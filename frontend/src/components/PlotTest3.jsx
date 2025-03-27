import * as d3 from "d3";
import { useEffect, useState } from "react";

const LinePlot = () => {
  const width = 640,
    height = 400,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 20,
    marginLeft = 20;

  const [data, setData] = useState({
    x_values: [],
    y_values: [],
    z_values: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("http://127.0.0.1:5000/api/data");
    const data = await response.json();
    setData(data);
    console.log(data);
  };

  const x = d3.scaleLinear(
    [0, data.x_values[-1]],
    [marginLeft, width - marginRight]
  );
  const y = d3.scaleLinear(
    [0, data.y_values[-1]],
    [height - marginBottom, marginTop]
  );
  // const line = d3.line((d, i) => x(i), y);
  var line = d3.line()
    .x((d) => x(d.values))
    .y((d) => y(d.values));

  return (
    <svg width={width} height={height}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d={line(data.x_values)}
      />
      <g fill="white" stroke="currentColor" strokeWidth="1.5">
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
        ))}
      </g>
    </svg>
  );
};

export default LinePlot;
