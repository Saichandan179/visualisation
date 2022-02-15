import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

const num = "numerical";

function ScatterPlot({ width, height, data, dataType }) {
  const ref = useRef();

  useEffect(() => {
    d3.select(ref.current).attr("width", width).attr("height", height);
  }, []);

  useEffect(() => {
    let svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    draw();
  }, [data]);

  const getAttri = (par) => {
    var lookup = {};
    var result = [];

    for(let i = 0; i < data.length; i++){
        var p = data[i][par];

        if (!(p in lookup)) {
            lookup[p] = 1;
            result.push(p);
        }
    }
    // console.log("result is", result);
    if(result.includes("High")) return ["Low", "Moderate", "High", "Very High"];

    result.sort();
    return result;
  }

  const draw = () => {

    var svg = d3.select(ref.current),
      margin = 200,
      width = svg.attr("width") - margin,
      height = svg.attr("height") - margin;
      

    // var xScale = d3.scaleLinear().domain([0, 100]).range([0, width]),
    //   yScale = d3.scaleLinear().domain([0, 200]).range([height, 0]);
    // let xScale = d3.scaleLinear().range([0, width]),
    //     yScale = d3.scaleLinear().range([height, 0]);

    // xScale.domain([0, d3.max(dataset1, function(d) { return d.x; })]);
    // yScale.domain([0, d3.max(dataset1, function(d) { return d.y; })]);
    // console.log("data is :", data, "datatype is :", dataType);
    

    var g = svg
      .append("g")
      .attr("transform", "translate(" + 70 + "," + 80 + ")");

    const zCat = dataType.var1 !== num && dataType.var2 !== num;

    let xScale = dataType.var1 === num ? d3.scaleLinear().range([0, width]) : d3.scaleBand().rangeRound([0, width]);
    let yScale = dataType.var2 === num ? d3.scaleLinear().range([height, 0]) : d3.scaleBand().rangeRound([height, 0]);
  
    dataType.var1 === num ? xScale.domain([0, d3.max(data, function(d) { return d.x; })]) : xScale.domain((getAttri('x')));
    dataType.var2 === num ? yScale.domain([0, d3.max(data, function(d) { return d.y; })]) : yScale.domain((getAttri('y')));

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    g.append("g").call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("x", width / 2 + 60)
      .attr("y", height + 130)
      .attr("text-anchor", "middle")
      .text(dataType.var1Label);

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(15," + 300 + ")rotate(-90)")
      .text(dataType.var2Label);

    g
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        // console.log("d in scatterplot: ", d);
        return dataType.var1 === num ? xScale(d.x) : xScale(d.x) + xScale.bandwidth()/2;
      })
      .attr("cy", function (d) {
        return dataType.var2 === num ? yScale(d.y) : yScale(d.y) + yScale.bandwidth()/2;
      })
      .attr("r", function (d) {
        return 0;
      })
      .style("fill", "#386BB6")
      .transition().duration(1000)
      .attr("r", function (d) {
        return zCat ? Math.floor(d.z*0.7) : 2;
      })
      .style("fill", "#386BB6");
  };

  return (
    <div className="ScatterPlot">
      <svg className={"scatterSVG"} ref={ref}></svg>
    </div>
  );
}

export default ScatterPlot;
