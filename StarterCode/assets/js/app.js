function makeResponsive() {
        
    // Set up chart
    var svgWidth = 860;
    var svgHeight = 500;

    var margin = {top: 20, right: 40, bottom: 60, left: 100};

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper

    var svg = d3.select('#scatter')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        
    // Append an SVG group that will hold our chart, and shift the latter by left and top margins.

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Retrieve data from CSV file and execute everything below

    d3.csv("assets/data/data.csv").then(function(stateData) {
        console.log(stateData); 

        // Converting data to integers

        stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.state = data.state;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smoke = +data.smoke
        });
        
        // Define scale functions

        var xMin = d3.min(stateData,(d=>d.poverty-1));
        var xMax = d3.max(stateData,(d=>d.poverty));
        var yMin = d3.min(stateData,(d=>d.healthcare-1));
        var yMax = d3.max(stateData,(d=>d.healthcare));
        var xMin1 = d3.min(stateData,(d=>d.age));
        var xMax1 = d3.max(stateData,(d=>d.age));
        var yMin1 = d3.min(stateData,(d=>d.smokes));
        var yMax1 = d3.max(stateData,(d=>d.smokes));
        var xMin2 = d3.min(stateData,(d=>d.income));
        var xMax2 = d3.max(stateData,(d=>d.income));
        var yMin2 = d3.min(stateData,(d=>d.obesity));
        var yMax2 = d3.max(stateData,(d=>d.obesity));
    
        var xScale = d3.scaleLinear()
                .domain([xMin, xMax])
                .range([0,width]);

        var yScale = d3.scaleLinear()
                .domain([yMin,yMax])
                .range([height,0]);

        // Create axis functions

        var bottomAxis = d3.axisBottom(xScale);
        var leftAxis = d3.axisLeft(yScale);

        // Append Axes to the chart

        chartGroup.append("g")
                .attr("transform",`translate (0,${height})`)
                .call(bottomAxis);

        chartGroup.append("g")
                .call(leftAxis);

        
        // Append circles to data points

        var circleGroup = chartGroup.selectAll("circle")
            .data(stateData)
            .enter()
            .append("circle")
            .attr("cx",d=>xScale(d.poverty))
            .attr("cy", d=>yScale(d.healthcare))
            .attr("r", "10")
            .attr("fill", "lightblue");

        circleGroup = chartGroup.selectAll()
            .data(stateData)
            .enter()
            .append("text")
            .attr("x", d=> xScale(d.poverty))
            .attr("y", d=> yScale(d.healthcare))
            .style("font-size", "12px")
            .style("text-anchor","middle")
            .style("fill","white")
            .text(d=>  d.abbr);
            
        // Initialize tool tip
        
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .style("display", "block")
            .html(function(d) {
                return (`${d.state} <br> Poverty : ${d.poverty} <br> Lack of Healthcare : ${d.healthcare}`)
                
                });

        // Create tooltip in the chart
        
        chartGroup.call(toolTip);

        // Create event listeners to display and hide the tooltip
        
        circleGroup.on("click", function(data){toolTip
            .show(data,this)
            .classed("active", true)
        })

        .on("mouseout", function(data, index) {toolTip
            .hide(data)
            .classed("inactive", true)
            });
    });
            
    // Append y-axis label
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 40)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .classed("axis-text", true)
        .text("Lack of Healthcare (%)")

    // Append x-axis labels
    chartGroup
        .append("text")
        .attr(
            "transform", `translate(${width / 2}, ${(height + margin.top + 30)})`
        )
        .classed("axis-text", true)
        .text("In Poverty (%)");

};

makeResponsive();

// Event listener for window resize. When the browser window is resized, makeResponsive() is called.

d3.select(window).on("resize", makeResponsive);
       

    

