var svg = d3.select(".optimized").append("svg")
  .attr("width", 690)
  .attr("height", 428);
var svg2 = d3.select(".defacto").append("svg")
  .attr("width", 690)
  .attr("height", 428);


d3.selectAll("svg").append("defs").append("marker").attr("id","pizza");

$.get("svgicons/pizza.svg",function(data){
  $(".pizza").html(data);
  console.log("success");
});
