import * as d3 from 'd3';


var x_values = [1, 3, 5, 9, 15];
var y_values = [1, 2, 3, 4, 5];
// var z_values = [1, 8, 15, 24, 38];

var svg = d3
  .select("div.plot")
  .append("svg")
  .attr("width", 500) // <-- Here
  .attr("height", 500); // <-- and here!

var circles = svg.selectAll("circle").data(x_values).enter().append("circle");

circles.attr("cx", function (d) {
    return d + "px";
  })
  .attr("cy", function (d, i) {
    return 500 - y_values[i] + "px";
  })
  .attr("r", 1)
  .attr("fill", "white")
  .attr("stroke", "black");
