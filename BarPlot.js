// Padding and Dimentions of the graph
var margin = {top: 10, right: 30, bottom: 50, left: 50},
width = 800 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// Appending the SVG object
var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right+100)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// Data Parsing
d3.csv("./dataset.csv", function(data) {

// Creating the list of subgroups to be plotted
var subgroups = data.columns.slice(2)

// Groups on the X axis
var groups = d3.map(data, function(d){return(d.Year)}).keys()
//console.log(subgroups)
//console.log(groups)
// Adding the  X axis
var x = d3.scaleBand()
  .domain(groups)
  .range([0, width])
  .padding([0.2])
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x).tickSize(0));

// Adding the Y axis
var y = d3.scaleLinear()
.domain([2000, 80000])
.range([ height, 0 ]);
svg.append("g")
.call(d3.axisLeft(y));

var xSubgroup = d3.scaleBand()
.domain(subgroups)
.range([0, x.bandwidth()])
.padding([0.05])

// Giving different colours to sub groups
var color = d3.scaleOrdinal()
.domain(subgroups)
.range(d3.schemeCategory10)

// Forming bars
svg.append("g")
.selectAll("g")
.data(data)
.enter()
.append("g")
  .attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; })
.selectAll("rect")
.data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
.enter().append("rect")
  .attr("x", function(d) { return xSubgroup(d.key); })
  .attr("y", function(d) { return y(d.value); })
  .attr("width", xSubgroup.bandwidth())
  .attr("height", function(d) { return height - y(d.value); })
  .attr("fill", function(d) { return color(d.key); });

//console.log(color.domain());
var legend=d3.select("#my_dataviz")
.select("svg").selectAll(".legend").data(color.domain()).enter()
    .append('g')
    .attr("transform", function (d, i) {
      var height = 22;
      var offset = (22 * color.domain().length) / 2;
      var horz = 790;
      var vert = 100 + i * height - offset;
      return "translate(" + horz + "," + vert + ")";
    });
legend
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d) { return color(d);})
    .style("stroke", color);

  legend
    .append("text")
    .attr("x", 22)
    .attr("y", 14)
    .text((d) => {
      if (d === "CowMilk") return "CowMilk";
      else if(d === "GoatMilk") return "GoatMilk";  
      else return "BuffaloMilk";
    });

})
// let myarray=["Cow Milk","Buffalo Milk","Goat Milk"];

