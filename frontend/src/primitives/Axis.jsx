import * as d3 from "d3";
import React, {useState, useEffect} from "react";

const Axis = () => {
//   const width = 640;
//   const height = 400;
  const padding = 20;
  
  var x_values = [1, 3, 5, 9, 15];
  var y_values = [1, 2, 3, 4, 5];
  const data = [];
  for (let i = 0; i < x_values.length; i++) {
    data.push({ x: x_values[i], y: y_values[i] });
  }
  console.log(data)

  const xScale = d3.scaleLinear([0, 15], [padding, width - padding]);
  const yScale = d3.scaleLinear([0, 5], [padding, height - padding]);
  const line = d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  return (
    <svg width={width} height={height}>
      <path
        fill="none"
        stroke="black"
        // strokeWidth="1.5"
        d={line(data)}
      />
      <g fill="white" stroke="black" data={data}>
        {data.map((d, i) => (
          <circle key={i} cx={xScale(d.x)} cy={yScale(d.y)} r="5" />
        ))}
      </g>
    </svg>
  );
};

export default Axis;
