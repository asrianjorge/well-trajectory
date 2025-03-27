import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const Plot3D = (width) => {
  const [data, setData] = useState({ x_values: [], y_values: [], z_values: [] });
  const [specificPoints, setSpecificPoints] = useState(false);
  console.log('>3D>', width.width, width.height)


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("http://127.0.0.1:5000/data");
    const data = await response.json();
    setData(data);
    console.log(data);
  };

  let x_values = [];
  let y_values = [];
  let z_values = [];

  for (let i=0; i<data.length; i++) {
    // console.log(i, data[i])
    x_values.push(data[i].x_values);
    y_values.push(data[i].y_values);
    z_values.push(data[i].z_values);
  }

  const tickProps = {
    color: "#fff",
    weight: 500,
    family: "Inter",
  };

  console.log(width)

  return (
    <Plot
      className="plt"
      data={[
        {
          x: x_values,
          y: y_values,
          z: z_values,
          // x: data[0],
          // y: data[1],
          // z: data[2],
          type: "scatter3d",
          mode: "lines+markers",
          autocolorscale: true,
          
          // type: 'line',
          line: {
            width: 6,
            // color: ["#fff", "rgb(46, 119, 255)", "#fff"],
            // autocolorscale: true,
            color: z_values,
            // colorscale: [
            //   ['0.0', 'rgb(165,0,38)'],
            //   ['0.111111111111', 'rgb(215,48,39)'],
            //   ['0.222222222222', 'rgb(244,109,67)'],
            //   ['0.333333333333', 'rgb(253,174,97)'],
            //   ['0.444444444444', 'rgb(254,224,144)'],
            //   ['0.555555555556', 'rgb(224,243,248)'],
            //   ['0.666666666667', 'rgb(171,217,233)'],
            //   ['0.777777777778', 'rgb(116,173,209)'],
            //   ['0.888888888889', 'rgb(69,117,180)'],
            //   ['1.0', 'rgb(49,54,149)']
            // ],
            colorscale: [
              ['0.0', '#1e90ff'],
              ['1.0', '#99badd']
            ],
            // colorscale: "Oranges",
            // colorscale: [[0, 'rgb(5,10,172)'], [0.35, 'rgb(106,137,247)'], [0.5, 'rgb(190,190,190)'], [0.6, 'rgb(220,170,132)'], [0.7, 'rgb(230,145,90)'], [1, 'rgb(178,10,28)'], ]
          },
          marker: {
            size: 3.5,
            color: z_values,
            // colorscale: [
            //   ['0.0', 'rgb(165,0,38)'],
            //   ['0.111111111111', 'rgb(215,48,39)'],
            //   ['0.222222222222', 'rgb(244,109,67)'],
            //   ['0.333333333333', 'rgb(253,174,97)'],
            //   ['0.444444444444', 'rgb(254,224,144)'],
            //   ['0.555555555556', 'rgb(224,243,248)'],
            //   ['0.666666666667', 'rgb(171,217,233)'],
            //   ['0.777777777778', 'rgb(116,173,209)'],
            //   ['0.888888888889', 'rgb(69,117,180)'],
            //   ['1.0', 'rgb(49,54,149)']
            // ],
            colorscale: [
              ['0.0', '#1e90ff'],
              ['1.0', '#99badd']
            ],
            // cmin: -20,
            // cmax: 50
          },
        },
      ]}
      layout={{ 
        // colorscale: ,
        pad: "0px",
        margin: {
          l: 20,
          t: 50,
          r: 20,
          b: 0,
        },
        width: width.width,
        height: width.height-60,
        title: "My Graph" ,
        color: "#ffffff",
        paper_bgcolor: "#0C0A08",
        plot_bgcolor: "rgb(0, 0, 0)",
        modebar:{
          activecolor: "rgba(255, 255, 255, 0.8)",
          color: "rgba(255, 255, 255, 0.4)",
          // bgcolor: "rgb(0, 0, 0)",
        },
        scene: {
          aspectmode: "data",
          camera: {
            center: {
              x: 0,
              y: 0,
              z: 0,
            },
            eye: {
              x: 2,
              y: 2,
              z: 2,
            },
          },
          xaxis: {
            backgroundcolor: "rgba(230, 230, 200, 0.5)",
            gridcolor: "rgb(255, 255, 255)",
            // linecolor: "rgb(255, 255, 255)",
            // showbackground: true,
            // zerolinecolor: "white",
            tickfont: tickProps,

          },
          yaxis: {
            backgroundcolor: "rgba(230, 200,230, 0.5)",
            gridcolor: "rgb(255, 255, 255)",
            // showbackground: true,
            zerolinecolor: "white",
            tickfont: tickProps,
          },
          zaxis: {
            backgroundcolor: "rgba(200, 230,230, 0.5)",
            gridcolor: "rgb(255, 255, 255)",
            // linecolor: "rgb(0, 0, 0)",
            // showbackground: true,
            zerolinecolor: "white",
            tickfont: tickProps,

          },
        },

        // xaxis: {
        //   backgroundcolor: "rgb(230, 230,200)",
        //   gridcolor: "rgb(46, 119, 255)",
        //   showbackground: true,
        //   zerolinecolor: "white",
        // },
        
      }}
    />
  );
};


export default Plot3D;

