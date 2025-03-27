import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const Plot2DSystem = () => {
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

  console.log(data);

  return (
    <div>
      <Plot
        data={[
          {
            x: data.x_values,
            y: data.y_values,
            // x: data[0],
            // y: data[1],
            // z: data[2],
            type: "scatter",
            mode: "lines+markers",
            line: {
              width: 6,
              // color: 'blue',
            //   colorscale: "Viridis",
            },
            marker: {
              size: 3.5,
              // color: 'red',
            //   colorscale: "Greens",
              cmin: -20,
              cmax: 50,
            },
          },
        ]}
        layout={{ width: 300, height: 300, title: "X0Y" }}
      />
      <Plot
        data={[
          {
            x: data.x_values,
            y: data.z_values,
            type: "scatter",
            mode: "lines+markers",
            line: {
              width: 6,
            //   colorscale: "Viridis",
            },
            marker: {
              size: 3.5,
            //   colorscale: "Greens",
              cmin: -20,
              cmax: 50,
            },
          },
        ]}
        layout={{ width: 300, height: 300, title: "X0Z" }}
      />
      <Plot className="plot_yoz"
        data={[
          {
            x: data.y_values,
            y: data.z_values,
            type: "scatter",
            mode: "lines+markers",
            line: {
              width: 6,
            //   colorscale: "Viridis",
            },
            marker: {
              size: 3.5,
            //   colorscale: "Greens",
              cmin: -20,
              cmax: 50,
            },
          },
        ]}
        layout={{ width: 300, height: 300, title: "Y0Z"  }}
      /> 
    </div>
  );
};

export default Plot2DSystem;
