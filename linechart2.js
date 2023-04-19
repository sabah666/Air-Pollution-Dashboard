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
  
    const maxPopulation = d3.max(filteredData1.concat(filteredData2), d => +d.Total_population);
    const maxAirPollution = d3.sum(
      filteredData1.concat(filteredData2), 
      d => +d["Air pollution (total) (deaths per 100,000)"]
    );
  
    const xScale = d3.scaleLinear()
      .domain([0, maxPopulation])
      .range([margin.left, width - margin.right]);
  
    const yScale = d3.scaleLinear()
      .domain([0, (maxAirPollution)/2])
      .range([height - margin.bottom, margin.top]);
  
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
  
    svg.select(".x-axis")
      .transition()
      .duration(1000)
      .call(xAxis);
  
    svg.select(".y-axis")
      .transition()
      .duration(1000)
      .call(yAxis);
  
    const lineGenerator = d3.line()
      .x(d => xScale(+d.Total_population))
      .y(d => yScale(+d["Air pollution (total) (deaths per 100,000)"]));
  
    svg.select(".line1")
      .datum(filteredData1)
      .transition()
      .duration(1000)
      .attr("d", lineGenerator);
  
    svg.select(".line2")
      .datum(filteredData2)
      .transition()
      .duration(1000)
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
            .attr("stroke", "#7600bc")
            .attr("stroke-width", 2);

            svg.append("path")
            .attr("class", "line2")
            .attr("fill", "none")
            .attr("stroke", "#1e90ff")
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