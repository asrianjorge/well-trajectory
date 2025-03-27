import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const PlotTest = () => {
  const [data, setData] = useState({ x_values: [], y_values: [], z_values: [] });


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("http://127.0.0.1:5000/api/data");
    const data = await response.json();
    setData(data);
    console.log(data);
  };

  console.log(data)

  return (
    <Plot
      data={[
        {
          x: data.x_values,
          y: data.y_values,
          z: data.z_values,
          // x: data[0],
          // y: data[1],
          // z: data[2],
          type: "scatter3d",
          mode: "lines+markers",
          line: {
            width: 6,
            // color: 'blue',
            colorscale: "Viridis"},
          marker: {
            size: 3.5,
            // color: 'red',
            colorscale: "Greens",
            cmin: -20,
            cmax: 50
          },
        },
      ]}
      layout={{ width: 720, height: 440, title: "My Graph" }}
    />
  );
};

export default PlotTest;