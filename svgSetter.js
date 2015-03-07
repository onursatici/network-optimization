var svg = d3.select(".optimized").append("svg")
  .attr("width", 690)
  .attr("height", 428);
var svg2 = d3.select(".defacto").append("svg")
  .attr("width", 690)
  .attr("height", 428);

d3.selectAll("svg").append("defs").append("marker")
  .attr("id", "triangle")
  .attr("refX", 3)
  .attr("refY", 3)
  .attr("markerWidth", 130)
  .attr("markerHeight", 130)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M1, 1 L1, 5 L5, 3 L1, 1")
  .attr("style", "fill:rgb(102,192,183); stroke-width:1px;");

d3.selectAll("defs").append("marker")
  .attr("id", "pizza")
  .attr("refX", 3)
  .attr("refY", 3)
  .attr("markerWidth", 130)
  .attr("markerHeight", 130)
  .attr("orient", 0)
  .attr("style", "fill:green; stroke-width:1px;");

d3.selectAll("defs").append("marker")
  .attr("id", "chicken")
  .attr("refX", 3)
  .attr("refY", 3)
  .attr("markerWidth", 130)
  .attr("markerHeight", 130)
  .attr("orient", 0)
  .attr("style", "fill:green; stroke-width:1px;");

d3.selectAll("defs").append("marker")
  .attr("id", "donut")
  .attr("refX", 3)
  .attr("refY", 3)
  .attr("markerWidth", 130)
  .attr("markerHeight", 130)
  .attr("orient", 0)
  .attr("style", "fill:green; stroke-width:1px;");

$("document").ready(function() {
  var pizzaHtml = $("#pizza-template").html();
  $("#pizza").html(pizzaHtml);
  $("#chicken").html($("#chicken-template").html());
  $("#donut").html($("#donut-template").html());
  console.log('done');
});
