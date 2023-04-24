// Load the dataset and generate the pie chart
d3.csv("cleanedDataset.csv").then(function(data) {

// Setting up margin, width and height for the line chart
const margin = {top: 40, right: 50, bottom: 10, left: 50};
const width = 400;
const height = 350;

  // Extract the unique entity names
  const entities = Array.from(new Set(data.map(d => d.Entity)));


  // Create the dropdown menu
  d3.select("#dropdown")
            .selectAll("option")
            .data(entities)
            .enter()
            .append("option")
            .text(d => d)
            .attr('value', d => d);

  // Set the initial entity to the first in the list
  let selectedEntity = entities[0];

  // Function to update the chart when the dropdown is changed
  function updateChart() {

    // removing old chart title and graph when the option in dropdown is changed
    d3.select("#Chart-title").remove();
    d3.select("#piesvg").remove();

    // creating id for chart title
    const title = d3.select("#PieChart")
      .append("h2")
      .attr("id","Chart-title");

    // Create SVG element for the chart
    const svg = d3.select("#PieChart")
      .append("svg")
      .attr("id","piesvg")
      .attr("width", 470 )
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height /2})`);


    selectedEntity = d3.select("#dropdown").property("value");
    
    // Filter the data by the selected entity and sum the outdoor air pollution columns
    const filteredData = data.filter(d => d.Entity === selectedEntity);
    
    // adding chart title and setting the font sze
    title.text(`Deaths in ${selectedEntity} due to Air Pollution:`)
    .style("font-size", "18px");

    // sum indoor and outdoor data 
    const indoordeaths = d3.sum(filteredData, function(d) { return +d["Indoor air pollution (deaths per 100,000)"]; });
    const outdoordeaths = d3.sum(filteredData, function(d) { return +d["Outdoor particulate matter (deaths per 100,000)"] + +d["Outdoor ozone pollution (deaths per 100,000)"]; });
    
    // Generate the pie chart
    const pieData = [ indoordeaths, outdoordeaths];

    // setting the color 
    const color = d3.scaleOrdinal()
      .domain(["Indoor air pollution", "Outdoor air pollution"])
      .range(["#563280", "#1e90ff"]);

    // generating pie chart 
    const pie = d3.pie()(pieData);

    // setting the radius for donut chart
    const arc = d3.arc()
      .innerRadius(50)
      .outerRadius(Math.min(width, height) / 2 - 1);

    const arcs = svg.selectAll("arc")
      .data(pie)
      .join("g")
      .attr("class", "arc");

    arcs.append("path")
      .transition()
      .duration(1000)
      .attrTween("d", function(d) {
          const start = { startAngle: 0, endAngle: 0 };
          const interpolate = d3.interpolate(start, d);
          return function(t) {
          return arc(interpolate(t));
          };
      })
      .attr("fill", d => color(d.data));

    // calculating value for each slice 
    arcs.append("text")
      .transition()
      .duration(850)
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .text((d) => `${(d.data / 1).toFixed(1)}`)

    arcs.enter().append("g")
      .attr("class", "arc")
      .append("path")
      .attr("fill", d => color(d.data))
      .attr("d", arc)
      .transition()
      .duration(750);
    

    // Generating the legend for the slices 
    const legend = svg
      .selectAll(".legend")
      .data(pieData)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    // shape for the legend 
    legend
      .append("rect")
      .attr("x", width - 220)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", (d) => color(d === indoordeaths ? "Indoor air pollution" : "Outdoor air pollution"));

    // adding text to the legend
    legend
      .append("text")
      .attr("x", width - 195)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text((d) => (d === indoordeaths ? "Indoor" : "Outdoor"));

  }

  // Calling the updateChart function 
  updateChart();

  d3.select("#dropdown")
        .on("change", updateChart);
    
}).catch(error => console.log(error));
