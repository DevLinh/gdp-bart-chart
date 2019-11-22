var urlSource =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

//set width and height for chart
var width = 800,
  height = 400;

var tooltip = d3
  .select(".visHolder")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

var overlay = d3
  .select(".visHolder")
  .append("div")
  .attr("class", "overlay")
  .style("opacity", 0);

var svg = d3
  .select(".visHolder")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 60)
  .attr("fill", "grey");

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  function(json) {
    var barWidth = width / json.data.length;

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .text("Gross Domestic Product")
      .attr("x", -300)
      .attr("y", 80);

    var years = json.data.map(function(item) {
      var quarter;
      var temp = item[0].substring(5, 7);
      if (temp === "01") {
        quarter = "Q1";
      } else if (temp === "04") {
        quarter = "Q2";
      } else if (temp === "07") {
        quarter = "Q3";
      } else if (temp === "10") {
        quarter = "Q4";
      }
      return item[0].substring(0, 4) + " " + quarter;
    });

    //convert DATA from string into Date format
    var yearsDate = json.data.map(function(item) {
      return new Date(item[0]);
    });

    var xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);

    var xScale = d3
      .scaleTime()
      .domain([d3.min(yearsDate), xMax])
      .range([0, width]);
    var xAxis = d3.axisBottom(xScale);

    var xAxisGroup = svg
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(60, 400)");

    var GDP = json.data.map(function(item) {
      return item[1];
    });

    var gdpMax = d3.max(GDP);
    //var gdpMin = d3.min(GDP);

    var linearScale = d3
      .scaleLinear()
      .domain([0, gdpMax])
      .range([0, height]);

    scaledGDP = GDP.map(function(item) {
      return linearScale(item);
    });

    var yAxisScale = d3
      .scaleLinear()
      .domain([0, gdpMax])
      .range([height, 0]);
    var yAxis = d3.axisLeft(yAxisScale);
    var yAxisGroup = svg
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(60,0)");

    d3.select("svg")
      .selectAll("rect")
      .data(scaledGDP)
      .enter()
      .append("rect")
      .attr("data-date", function(d, i) {
        return json.data[i][0];
      })
      .attr("data-gdp", function(d, i) {
        return json.data[i][1];
      })
      .attr("class", "bar")
      .attr("x", function(d, i) {
        return xScale(yearsDate[i]);
      })
      .attr("y", function(d, i) {
        return height - d;
      })
      .attr("width", barWidth)
      .attr("height", function(d) {
        return d;
      })
      .attr("transform", "translate(60,0)")
      .on("mouseover", function(d, i) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip
          .html(years[i] + "<br>" + "$" + GDP[i] + " Billion")
          .attr("data-date", json.data[i][0])
          .style("left", i * barWidth + 30 + "px")
          .style("top", height - 100 + "px")
          .style("transform", "translateX(60px)");
        overlay
          .transition()
          .duration(0)
          .style("height", d + "px")
          .style("width", barWidth + "px")
          .style("opacity", 0.9)
          .style("left", i * barWidth + 0 + "px")
          .style("top", height - d + "px")
          .style("transform", "translateX(60px)");
      })
      .on("mouseout", function(d) {
        tooltip
          .transition()
          .duration(300)
          .style("opacity", 0);
        overlay
          .transition()
          .duration(300)
          .style("opacity", 0);
      });
  }
);
