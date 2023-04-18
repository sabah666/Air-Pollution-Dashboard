// import { json, csv } from 'd3';

// Load the geojson data
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(geojson) {
  // Load the csv data
  d3.csv("cleanedDataset.csv").then(function(data) {
    // Merge the geojson and csv data
    geojson.features = geojson.features.filter(function(d) { return d.properties.name != "Antarctica" });
    for (var i = 0; i < data.length; i++) {
      const dataCountry = data[i].Entity;
      const dataYear = data[i].Year;
      const dataValue = parseFloat(data[i].Total_population);
      const pollutionValue = parseFloat(data[i]["Air pollution (total) (deaths per 100,000)"]);
      for (var j = 0; j < geojson.features.length; j++) {
        var jsonCountry = geojson.features[j].properties.name;
        if (dataCountry == jsonCountry) {
          geojson.features[j].properties.value = dataValue;
          geojson.features[j].properties.pollution = pollutionValue;
          geojson.features[j].properties.year = dataYear;
          break;
        }
      }
    }

    // Set the dimensions and margins of the map
    const width = 960;
    const height = 500;

    // Create a tooltip div
    const tooltip = d3.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    // Set the projection and path
    const projection = d3.geoMercator()
                         .scale(130)
                         .translate([width / 2, height / 1.5]);

    const path = d3.geoPath()
                   .projection(projection);

    // Create the SVG element and set its dimensions
    const svg = d3.select("#map")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

    // Set the color scale
    const color = d3.scaleSequential(d3.interpolateTurbo)
                    .domain([0, d3.max(data, function(d) { return parseFloat(d.Total_population); })]);

    // Draw the map
    svg.selectAll("path")
       .data(geojson.features)
       .join("path")
       .attr("d", path)
       .style("fill", function(d) {
         var value = d.properties.value;
         return value ? color(value) : "#ccc";
       })
       .on("mouseover", function(event, d) {
         tooltip.transition()
                .duration(200)
                .style("opacity", .9);
         tooltip.html(d.properties.name + "<br>" + "Year: " + d.properties.year + "<br>" + "Total Population: " + d.properties.value + "<br>" + "Deaths due to Total Air Pollution: " + d.properties.pollution)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
       })
       .on("mouseout", function(d) {
         tooltip.transition()
                .duration(500)
                .style("opacity", 0);
       });
  });
});
