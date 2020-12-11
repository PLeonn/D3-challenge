var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
      d3.max(data, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }
  
  function renderText(circlesTextGroup, newXScale,  newYScale, chosenXAxis, chosenYAxis) {
  
    circlesTextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
  
    return circlesTextGroup;
  }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  
    var xlabel;
    if (chosenXAxis === "poverty") {
      xlabel = "In Poverty(%):";
    }
    else if (chosenXAxis === "age") {
      xlabel = "Age (Median):";
    }
    else if (chosenXAxis === "income") {
      xlabel = "Household Income (Median):";
    }
  
    var ylabel;
  
    if (chosenYAxis === "obesity") {
      ylabel = "Obese (%):";
    }
    else if (chosenYAxis === "smokes") {
      ylabel = "Smokes (%):";
    }
    else if (chosenYAxis === "healthcare") {
      ylabel = "Lacks Healthcare (%):";
    }
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .style("background","grey")
      .style("color","white")
      .offset([80, -60])
      .html(function(d) {
        if (chosenXAxis ==="poverty")
        return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
        else if (chosenXAxis === "age")
        return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
        else if (chosenXAxis === "income")
        return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
      });
  
  
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
  
  // Retrieve data from the CSV file and execute everything below
  d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;
  
    // Parse data
    data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      data.healthcare = +data.healthcare;
    });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
  
    // yLinearScale function above csv import
    var yLinearScale = yScale(data, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    var yAxis= chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 15)
      .attr("fill", "blue")
      .attr("opacity", ".5");
  
    //text in circle
    var circlesTextGroup = chartGroup.selectAll()
      .data(data)
      .enter()
      .append("text")
      .text(d=>(d.abbr))
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .attr("fill", "black");
  
    // Create group for three x-axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty(%)");
  
    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");
  
    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");
      
    // Create group for three y-axis labels
    var obesityLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", (margin.left) * 2.5)
      .attr("y", 0 - (height + 90))
      .attr("value", "obesity")
      .classed("active", true)
      .text("Obease (%)");
  
    var smokesLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", (margin.left) * 2.5)
      .attr("y", 0 - (height + 70))
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");
  
    var lacksHealthcareLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", (margin.left) * 2.5)
      .attr("y", 0 - (height + 50))
      .attr("value", "healthcare")
      .classed("inactive", true)
      .text("Lacks Healthcare (%)");
  
