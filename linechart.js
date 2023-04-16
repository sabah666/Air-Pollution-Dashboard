    //   reading the csv file
    d3.csv("cleanedDataset.csv").then(function(data) {

        // set the dimensions of the chart
    const width = 1000;
    const height = 500;
    const margin = { top: 20, right: 50, bottom: 50, left: 60 };

    const svg = d3.select("#linechart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g");

      const entities = Array.from(new Set(data.map(d => d.Entity)));
      
      d3.select("#entity-select")
        .selectAll("option")
        .data(entities)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

        d3.select("#entity2-select")
  .selectAll("option")
  .data(entities)
  .enter()
  .append("option")
  .text(d => d)
  .attr("value", d => d);

        
  const updateChart = function(entity1, entity2) {
  const filteredData1 = data.filter(d => d.Entity === entity1);
  const filteredData2 = data.filter(d => d.Entity === entity2);

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData1.concat(filteredData2), d => +d.Total_population)])
    .range([50, 750]);
        
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData1.concat(filteredData2), d => +d["Air pollution (total) (deaths per 100,000)"])])
    .range([450, 50]);
        
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.selectAll(".x-axis")
    .call(xAxis);
        
  svg.selectAll(".y-axis")
    .call(yAxis);
        
  const lineGenerator = d3.line()
    .x(d => xScale(+d.Total_population))
    .y(d => yScale(+d["Air pollution (total) (deaths per 100,000)"]));
        
  svg.selectAll(".line1")
    .datum(filteredData1)
    .attr("d", lineGenerator);
        
  svg.selectAll(".line2")
    .datum(filteredData2)
    .attr("d", lineGenerator);

};

d3.select("#entity-select")
  .on("change", function() {
    const selectedEntity1 = d3.select(this).property("value");
    const selectedEntity2 = d3.select("#entity2-select").property("value");
    updateChart(selectedEntity1, selectedEntity2);
  });
  
d3.select("#entity2-select")
  .on("change", function() {
    const selectedEntity1 = d3.select("#entity-select").property("value");
    const selectedEntity2 = d3.select(this).property("value");
    updateChart(selectedEntity1, selectedEntity2);
  });

        
      const xAxisGroup = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, 450)");
        
      const yAxisGroup = svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(50, 0)");
        
        svg.append("path")
            .attr("class", "line1")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 2);

            svg.append("path")
            .attr("class", "line2")
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2);

            svg.append("text")
            .attr("class", "axis-label")
            .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
            .attr("y", height - margin.bottom / 7)
            .attr("text-anchor", "middle")
            .text("Total Population");

            svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height - margin.top - margin.bottom) / 2 - margin.top)
            .attr("y", margin.left / 5)
            .attr("text-anchor", "middle")
            .text("Deaths due to Total Air Pollution");

            const initialEntity1 = entities[0];
            const initialEntity2 = entities[0];
            updateChart(initialEntity1, initialEntity2);

    });