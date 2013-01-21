/*
*   This takes data passed in from console.chart() and draws a new svg chart (with
*   the help of d3), updating it with each new data.
*
*   Try it out in the console: 
*   setInterval(function(){console.chart(Math.sin(Date.now()/1000))});
*
*/

var margin = {top: 50, right: 20, bottom: 30, left: 50},
    width = (window.innerWidth-40) - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(0);

var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var xsvg = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

var ysvg = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

var svgline = svg.append("path")
    .attr("class", "line")
    

function graphData(data) {
    x.domain(d3.extent(data.values, function(d) { return d.x; }));
    y.domain(d3.extent(data.values, function(d) { return d.y; }));
    xsvg.call(xAxis);
    ysvg.call(yAxis);

    svgline.datum(data.values)
      .attr("d", line);
};


// this attaches to the reset button and clears the data on this tab
document.getElementById("reset").onclick = function() {
    port.postMessage({type:"reset", id:chrome.devtools.inspectedWindow.tabId});
}

// connect to port
var port = chrome.extension.connect({name:"consolechart"});

// get data from background script every tenth second
setInterval(function(){ port.postMessage({type:"get", id:chrome.devtools.inspectedWindow.tabId}, 100)});

// attach event listener
port.onMessage.addListener(function (msg) { 
    if (msg) {
        graphData(msg[0]);
    }
});
