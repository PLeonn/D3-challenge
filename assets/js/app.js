// Set up base D3 variables
var svgWidth = 960;
var svgHeight = 500;

var margins = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margins.left - margins.right;
var height = svgHeight - margins.top - margins.bottom;

// Create SVG wrapper, append SVG group for chart including margins
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create initial parameters
var myXAxis = "poverty";
var myYAxis = "healthcare";

