    // Read the data from the CSV file
    d3.csv("cleanedDataset.csv", d => ({
        entity: d.Entity,
        year: +d.Year,
        pollution: +d["Air pollution (total) (deaths per 100,000)"]
    })).then(data => {

    // setting the dimensions of the bar chart 
    const margin = {top: 1, right: 50, bottom: 50, left: 50};
    const width = 900;
    const height = 450;

    // Select the SVG container for the chart
    const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width )
    .attr("height", height)
    .append("g");

    // calculate the inner width and height of the chart
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Define the x scales
    const xScale = d3.scaleBand()
        .range([0, innerWidth])
        .padding(0.1);

    // Define the y scales
    const yScale = d3.scaleLinear()
        .range([innerHeight, 0]);

    // Define the x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);


        // Get the unique entities 
        const entities = Array.from(new Set(data.map(d => d.entity)));

        // Add the entities to the dropdown menu
        d3.select("#entity-select3")
            .selectAll("option")
            .data(entities)
            .enter()
            .append("option")
            .text(d => d)
            .attr('value', d => d);
        

        // Initialize the selected entity to the first value in the dataset
        let selectedEntity = entities[0];
        
        // Define a function that will update the chart based on the user's selection.
        const updateChart = () => {

            // Get the selected entity
            selectedEntity = d3.select("#entity-select3").property("value");

            // Filter the data based on the selected entity
            const filteredData = data.filter(d => d.entity === selectedEntity );

            // Set the domains of the x and y scales
            xScale.domain(filteredData.map(d => d.year));
            yScale.domain([0, d3.max(filteredData, d => d.pollution)]);

            // Update the x-axis
            svg.select(".x-axis")
                .transition()
                .duration(1000)
                .call(xAxis);

            // Update the y-axis
            svg.select(".y-axis")
                .transition()
                .duration(1000)
                .call(yAxis);

            // connect the data to the bars
            const bars = svg.selectAll(".bar")
                .data(filteredData);

            // Remove the bars that are no longer needed
            bars.exit()
                .transition()
                .duration(1000)
                .attr("height", 0)
                .remove();

            // Update the existing bars
            bars.transition()
                .duration(1000)
                .attr("x", d => xScale(d.year)+50)
                .attr("y", d => yScale(d.pollution))
                .attr("width", xScale.bandwidth())
                .attr("height", d => innerHeight - yScale(d.pollution));
            

            // Add new bars for any data points that don't have a corresponding bar
            bars.enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => xScale(d.year)+50)
                .attr("y", innerHeight)
                .attr("width", xScale.bandwidth())
                .attr("height", 0)
                .transition()
                .duration(1000)
                .attr("y", d => yScale(d.pollution))
                .attr("height", d => innerHeight - yScale(d.pollution))
                .attr("fill", "#1e90ff");

    };

        // Add the x-axis to the chart
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(${margin.left},${height - margin.bottom})`);

        // Add the y-axis to the chart
        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add the text for the x- axis
        svg.append("text")
            .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
            .attr("y", height - margin.bottom / 7)
            .text("Year");

        // Add the text for the y- axis
        svg.append("text")
            .attr("x", -(height - margin.top - margin.bottom) / 2 - margin.top)
            .attr("x", -(height ) / (1.6) - margin.top)
            .attr("y", margin.left / 4)
            .attr("transform", "rotate(-90)")
            .text("Deaths due to Total Air Pollution");

    // call te update function
    updateChart();

    // Add event listeners to the dropdown menus to update the chart when the user makes a selection
    d3.select("#entity-select3")
        .on("change", updateChart);
    

}).catch(error => console.log(error));

