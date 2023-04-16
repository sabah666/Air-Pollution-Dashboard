// read in the CSV file and group the data by year
d3.csv("cleanedDataset.csv", d3.autoType).then(data => {

    // set the dimensions of the chart
    const width = 500;
    const height = 400;
    const margin = { top: 20, right: 50, bottom: 50, left: 60 };

    // create the SVG element
    const svg = d3.select("#ClusteredBarChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const nestedData = d3.group(data, d => d.Year);
  const sumData = Array.from(nestedData, ([key, value]) => ({ Year: key, sum: d3.sum(value, d => d["Outdoor particulate matter (deaths per 100,000)"]) }));

  // set the scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(sumData, d => d.sum)])
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleBand()
    .domain(sumData.map(d => d.Year))
    .range([height - margin.bottom, margin.top])
    .paddingInner(0.1);

  // create the bars
  const groups = svg.selectAll("g")
    .data(sumData)
    .join("g")
    .attr("transform", d => `translate(0,${yScale(d.Year)})`);

  groups.append("rect")
    .attr("x", margin.left)
    .attr("y", 0)
    .attr("width", d => xScale(d.sum) - margin.left)
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");

    // add value labels at the end of each bar for when the page loads 
    groups.append("text")
    .attr("x", d => xScale(d.sum) + 7)
    .attr("y", yScale.bandwidth() / 2.5)
    .text(d => `${(d.sum / 1000).toFixed(1)}K`)
    .attr("dy", "0.35em");


    // function to generate the chart on the selected option in the dropdown menu 
    function updateChart() {
    const dataType = document.getElementById("data-type").value;

    const sumData = Array.from(nestedData, ([key, value]) => ({
        Year: key,
        sum: d3.sum(value, (d) => d[dataType]),
    }));

    xScale.domain([0, d3.max(sumData, (d) => d.sum)]);

    const bars = svg.selectAll("rect").data(sumData);

    // generating the bars 
    bars
        .enter()
        .append("rect")
        .attr("x", margin.left)
        .attr("y", (d) => yScale(d.Year))
        .attr("height", yScale.bandwidth())
        .merge(bars)
        .transition()
        .duration(500)
        .attr("width", (d) => xScale(d.sum) - margin.left)
        .attr("fill", "steelblue");

    bars.exit().remove();

    const labels = svg.selectAll("text").data(sumData);

    // adding labels to the bars 
    labels
        .enter()
        .append("text")
        .attr("x", (d) => xScale(d.sum) + 7)
        .attr("y", (d) => yScale(d.Year) + yScale.bandwidth() / 2.5)
        .attr("dy", "0.35em")
        .merge(labels)
        .transition()
        .duration(500)
        .text((d) => `${(d.sum / 1000).toFixed(1)}K`)
        .attr("x", (d) => xScale(d.sum) + 7 + 5); // add padding of 5 pixels so the labels and the bars do not overlap 

    labels.exit().remove();


    svg.select(".x-axis").call(xAxis);

    d3.axisBottom(xScale);
    d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);

        // label for x-axis 
    svg.append("text")
        .attr("x", (width - margin.left - margin.right) / 7 + margin.left)
        .attr("y", height - margin.bottom / 7)
        .text(dataType);

        // label for y-axis 
    svg.append("text")
        .attr("x", -(height - margin.top - margin.bottom) / 2 - margin.top)
        .attr("y", margin.left / 5)
        .attr("transform", "rotate(-90)")
        .text("Year");
    }

        d3.select("#data-type").on("change", updateChart);


  // add the axes and labels for whrn the page loads 
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

svg.append("text")
        .attr("x", (width - margin.left - margin.right) / 7 + margin.left)
        .attr("y", height - margin.bottom / 7)
        .text("Outdoor particulate matter (deaths per 100,000)");

    svg.append("text")
        .attr("x", -(height - margin.top - margin.bottom) / 2 - margin.top)
        .attr("y", margin.left / 5)
        .attr("transform", "rotate(-90)")
        .text("Year");

  
});