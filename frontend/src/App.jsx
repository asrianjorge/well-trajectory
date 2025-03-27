import { useEffect, useState } from "react";
// import Plot3D from "./components/Plot3D";
// import Plot2D from "./components/Plot2D";
// import Navbar from "./components/Navbar";
import "./App.css";
import fileimg from "./icons/file.png";
import arrowimg from "./icons/angle-left.png";
import { NavLink } from "react-router";
import Plot from "react-plotly.js";

//-------------------------------------------General

// const [specificPoints, setSpecificPoints] = useState(false);
// const [data, setData] = useState({
//   x_values: [],
//   y_values: [],
//   z_values: [],
// });

// useEffect(() => {
//   fetchData();
// }, []);

// const fetchData = async () => {
//   const response = await fetch("http://127.0.0.1:5000/data");
//   const data = await response.json();
//   setData(data);
//   console.log(data);
// };

// let x_values = [];
// let y_values = [];
// let z_values = [];

// for (let i = 0; i < data.length; i++) {
//   // console.log(i, data[i])
//   x_values.push(data[i].x_values.toFixed(2));
//   y_values.push(data[i].y_values.toFixed(2));
//   z_values.push(-data[i].z_values.toFixed(2));
// }

//-----------------------------------------NavMethod

const NavMethod = (props) => {
  const { changeCheckbox } = props;

  return (
    <div className="btn-navbar-grid">
      <div className={"subtitle"}>
        <div>Choose Method</div>
      </div>
      <div>
        <button
          className="btn-navbar-method btn-clicked"
          id="minimum_curvature_method"
          onClick={() => changeCheckbox(0)}
        >
          Minimum Curvature Method 🟩
        </button>
      </div>
      
      <div>
        <button
          className="btn-navbar-method"
          id="balanced_tangential_method"
          onClick={() => changeCheckbox(1)}
        >
          Balanced Tangential Method 🟩
        </button>
      </div>
      <div>
        <button
          className="btn-navbar-method"
          id="adaptive_trajectory_method"
          onClick={() => changeCheckbox(2)}
        >
          Runge-Kutta-4 🟨
        </button>
      </div>
      <div>
        <button
          className="btn-navbar-method"
          id="radius_of_curvature_method"
          onClick={() => changeCheckbox(3)}
        >
          Radius of Curvature Method 🟥
        </button>
      </div>
      <div>
        <button
          className="btn-navbar-method"
          id="average_angles_method"
          onClick={() => changeCheckbox(4)}
        >
          Average Angles Method 🟥
        </button>
      </div>
      
    </div>
  );
};

//--------------------------------------------Navbar

const Navbar = (props) => {
  const { depth, zenit, azimut, handleClick } = props;

  // let x_values = props.x_values;
  // let y_values = props.y_values;
  // let z_values = props.z_values;

  return (
    <div className="btn-navbar-grid">
     
      {depth.map((d, i) => (
        <button
          key={i}
          id={i}
          className={"btn-navbar"}
          onClick={() => handleClick(i)}
        >
          <div className="opacity25">{i}</div>
          <div>{d.toFixed(2)}</div>
          <div>{zenit[i].toFixed(2)}</div>
          <div>{azimut[i].toFixed(2)}</div>
        </button>
      ))}
    </div>
  );
};

//--------------------------------------Plot2D-Angle

const Plot2DAngle = (props) => {
  let x_values = props.x_values;
  let y_values = props.y_values;

  let title = props.type;
  let color = "#99BADD";
  if (props.type == "Azimut") {
    color = "#1E90FF";
  }
  const tickProps = {
    color: "#fff",
    weight: 500,
    family: "Inter",
    size: 10,
  };

  return (
    <Plot
      className="plt"
      data={[
        {
          x: x_values,
          y: y_values,
          type: "scatter",
          mode: "lines+markers",
          // colorscale: [
            //   ["0.0", "#1e90ff"],
            //   ["1.0", "#99badd"],
            // ],
          line: {
            width: 2,
            color: color,
            
          },
          marker: {
            size: 5,
            color: color,
          },
        },
      ]}
      layout={{
        pad: "0px",
        margin: {
          l: 30,
          t: 50,
          r: 0,
          b: 20,
        },
        width: props.width,
        height: props.height - 40,
        title: {
          text: title,
          font: {
            family: "Inter",
            color: "rgba(255, 255, 255, 0.25)",
            weight: 400,
          },
        },
        color: "#fff",
        // paper_bgcolor: "#0C0A08",
        // plot_bgcolor: "#0C0A08",
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        modebar: {
          activecolor: "rgba(255, 255, 255, 0.8)",
          color: "rgba(255, 255, 255, 0.4)",
        },
        xaxis: {
          backgroundcolor: "rgba(230, 230, 200, 0.5)",
          gridcolor: "rgba(255, 255, 255, 0.5)",
          zerolinecolor: "white",
          tickfont: tickProps,
        },
        yaxis: {
          backgroundcolor: "rgba(230, 200,230, 0.5)",
          gridcolor: "rgba(255, 255, 255, 0.5)",
          zerolinecolor: "white",
          tickfont: tickProps,
        },
      }}
    />
  );
};

//--------------------------------------------Plot2D

const Plot2D = (props) => {
  let x_values = props.x_values;
  let y_values = props.y_values;

  let dataPlots = props.data_plots;
  // let propsMethods = props.methods;
  // propsMethods.foreach((element, i) => {
  //   if (element===1) {dataPlots.push(props.data_plots[i])}
  // });

  let title = "Plan X0Y";
  // let color = "#99BADD";
  if (props.type == "xz") {
    x_values = props.x_values;
    y_values = props.z_values;
    title = "Profile X0Z";
    // color = "#5CA5EE";
  } else if (props.type == "yz") {
    x_values = props.y_values;
    y_values = props.z_values;
    title = "Profile Y0Z";
    // color = "#1E90FF";
  }
  const tickProps = {
    color: "#fff",
    weight: 500,
    family: "Inter",
    size: 10,
  };

  return (
    <Plot
      className="plt"
      data={dataPlots}
      layout={{
        showlegend: false,
        pad: "0px",
        margin: {
          l: 40,
          t: 40,
          r: 20,
          b: 20,
        },
        width: props.width,
        height: props.height - 20,
        title: {
          text: title,
          font: {
            family: "Inter",
            color: "rgba(255, 255, 255, 0.25)",
            weight: 400,
          },
        },
        color: "#fff",
        // paper_bgcolor: "#0C0A08",
        // plot_bgcolor: "#0C0A08",
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        modebar: {
          activecolor: "rgba(255, 255, 255, 0.8)",
          color: "rgba(255, 255, 255, 0.4)",
        },
        xaxis: {
          backgroundcolor: "rgba(230, 230, 200, 0.5)",
          gridcolor: "rgba(255, 255, 255, 0.5)",
          zerolinecolor: "white",
          tickfont: tickProps,
        },
        yaxis: {
          backgroundcolor: "rgba(230, 200,230, 0.5)",
          gridcolor: "rgba(255, 255, 255, 0.5)",
          zerolinecolor: "white",
          tickfont: tickProps,
        },
      }}
    />
  );
};

//--------------------------------------------Plot3D

const Plot3D = (props) => {
  // console.log('>3D>', width.width, width.height)

  const tickProps = {
    color: "#fff",
    weight: 500,
    family: "Inter",
  };

  // console.log(">>>", props.data_plots);
  // let dataPlots = props.data_plots;
  let dataPlots = props.data_plots;
  // props.methods.forEach((element, i) => {
  //   if (element === 1) {
  //     dataPlots.push(props.data_plots[i]);
  //   }
  // });

  // var data1 = {
  //   x: props.x_values,
  //   y: props.y_values,
  //   z: props.z_values,
  //   type: "scatter3d",
  //   mode: "lines+markers",
  //   autocolorscale: true,
  //   line: {
  //     width: 6,
  //     color: props.z_values,
  //     colorscale: [
  //       ["0.0", "#1e90ff"],
  //       ["1.0", "#99badd"],
  //     ],
  //   },
  //   marker: {
  //     size: 4,
  //     color: props.z_values,
  //     colorscale: [
  //       ["0.0", "#1e90ff"],
  //       ["1.0", "#99badd"],
  //     ],
  //   },
  // };

  // console.log(props)

  return (
    <Plot
      className="plt"
      data={dataPlots}
      layout={{
        legend: {
          "orientation": "h",
          x: 0,
          // xanchor: 'bottom',
          y: 0,
          // bgcolor: 'white',
        },
        pad: "0px",
        margin: {
          l: 20,
          t: 60,
          r: 20,
          b: 0,
        },
        width: props.width,
        height: props.height - 60,
        title: {
          text: "3D",
          font: {
            family: "Inter",
            color: "rgba(255, 255, 255, 0.25)",
            weight: 400,
          },
        },
        color: "#ffffff",
        // paper_bgcolor: "#0C0A08",
        // plot_bgcolor: "#0C0A08",
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        modebar: {
          activecolor: "rgba(255, 255, 255, 0.8)",
          color: "rgba(255, 255, 255, 0.4)",
        },
        scene: {
          camera: {
            center: {
              x: 0,
              y: 0,
              z: -0.125,
            },
            eye: {
              x: 1.25,
              y: 1.25,
              z: 1.5,
            },
            // projection: "perspective" | "orthographic",
            projection: {
              type: props.projection,
              
            },
          },
          aspectmode: props.aspectmode,
          // aspectmode: "data",
          xaxis: {
            // backgroundcolor: "rgba(230, 230, 200, 0.5)",
            gridcolor: "rgb(255, 255, 255)",
            zerolinecolor: "white",
            tickfont: tickProps,
          },
          yaxis: {
            // backgroundcolor: "rgba(230, 200,230, 0.5)",
            gridcolor: "rgb(255, 255, 255)",
            zerolinecolor: "white",
            tickfont: tickProps,
          },
          zaxis: {
            // backgroundcolor: "rgba(200, 230,230, 0.5)",
            gridcolor: "rgb(255, 255, 255)",
            zerolinecolor: "white",
            tickfont: tickProps,
          },
        },
      }}
    />
  );
};

//-----------------------------------------------App

const App = () => {
  const [specificPoints, setSpecificPoints] = useState(-1);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [angles, setAngles] = useState({
    depth: [],
    zenit: [],
    azimut: [],
  });
  const [minimumCurvatureMethod, setMinimumCurvatureMethod] = useState({
    x_values: [],
    y_values: [],
    z_values: [],
  });
  const [radiusOfCurvatureMethod, setRadiusOfCurvatureMethod] = useState({
    x_values: [],
    y_values: [],
    z_values: [],
  });
  const [balancedTangentialMethod, setBalancedTangentialMethod] = useState({
    x_values: [],
    y_values: [],
    z_values: [],
  });
  const [averageAnglesMethod, setAverageAnglesMethod] = useState({
    x_values: [],
    y_values: [],
    z_values: [],
  });
  const [adaptiveTrajectoryMethod, setAdaptiveTrajectoryMethod] = useState({
    x_values: [],
    y_values: [],
    z_values: [],
  });
  const [ab, setAB] = useState([0, angles.length]);
  const [pointsCount, setPointsCount] = useState(30);
  const [aspectMode, setAspectMode] = useState("auto");
  const [projection, setProjection] = useState("perspective");
  const [methods, setMethods] = useState([1, 0, 0, 0, 0]);

  // if (aspectMode=="cube") {
  //   // document.getElementById(aspectMode).classList.remove("btn-clicked")
  //   document.getElementById(aspectMode).classList.add("btn-clicked")
  //   // document.getElementById("cube").classList.add("btn-clicked")
  // };
  // setAspectMode();


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response_angles = await fetch("http://127.0.0.1:5000/data/angles");
    const data_angles = await response_angles.json();
    setAngles(data_angles);

    const response_minimumCurvatureMethod = await fetch(
      "http://127.0.0.1:5000/data/minimum_curvature_method"
    );
    const data_minimumCurvatureMethod =
      await response_minimumCurvatureMethod.json();
    setMinimumCurvatureMethod(data_minimumCurvatureMethod);

    const response_radiusOfCurvatureMethod = await fetch(
      "http://127.0.0.1:5000/data/radius_of_curvature_method"
    );
    const data_radiusOfCurvatureMethod =
      await response_radiusOfCurvatureMethod.json();
    setRadiusOfCurvatureMethod(data_radiusOfCurvatureMethod);

    const response_balanced_tangential_method = await fetch(
      "http://127.0.0.1:5000/data/balanced_tangential_method"
    );
    const data_balanced_tangential_method =
      await response_balanced_tangential_method.json();
    setBalancedTangentialMethod(data_balanced_tangential_method);
    
    const response_average_angles_method = await fetch(
      "http://127.0.0.1:5000/data/average_angles_method"
    );
    const data_average_angles_method =
      await response_average_angles_method.json();
    setAverageAnglesMethod(data_average_angles_method);
    
    const response_adaptive_trajectory_method = await fetch(
      "http://127.0.0.1:5000/data/adaptive_trajectory_method"
    );
    const data_adaptive_trajectory_method =
      await response_adaptive_trajectory_method.json();
      setAdaptiveTrajectoryMethod(data_adaptive_trajectory_method);
  };

  let x_values = [];
  let y_values = [];
  let z_values = [];
  let x_values_rocm = [];
  let y_values_rocm = [];
  let z_values_rocm = [];
  let x_values_btm = [];
  let y_values_btm = [];
  let z_values_btm = [];
  let x_values_aam = [];
  let y_values_aam = [];
  let z_values_aam = [];
  let x_values_atm = [];
  let y_values_atm = [];
  let z_values_atm = [];
  let depth = [];
  let zenit = [];
  let azimut = [];
  for (let i = 0; i < minimumCurvatureMethod.length; i++) {
    x_values.push(minimumCurvatureMethod[i].x_values);
    y_values.push(minimumCurvatureMethod[i].y_values);
    z_values.push(minimumCurvatureMethod[i].z_values);
  }
  for (let i = 0; i < radiusOfCurvatureMethod.length; i++) {
    x_values_rocm.push(radiusOfCurvatureMethod[i].x_values);
    y_values_rocm.push(radiusOfCurvatureMethod[i].y_values);
    z_values_rocm.push(radiusOfCurvatureMethod[i].z_values);
  }
  for (let i = 0; i < balancedTangentialMethod.length; i++) {
    x_values_btm.push(balancedTangentialMethod[i].x_values);
    y_values_btm.push(balancedTangentialMethod[i].y_values);
    z_values_btm.push(balancedTangentialMethod[i].z_values);
  }
  for (let i = 0; i < averageAnglesMethod.length; i++) {
    x_values_aam.push(averageAnglesMethod[i].x_values);
    y_values_aam.push(averageAnglesMethod[i].y_values);
    z_values_aam.push(averageAnglesMethod[i].z_values);
  }
  for (let i = 0; i < adaptiveTrajectoryMethod.length; i++) {
    x_values_atm.push(adaptiveTrajectoryMethod[i].x_values);
    y_values_atm.push(adaptiveTrajectoryMethod[i].y_values);
    z_values_atm.push(adaptiveTrajectoryMethod[i].z_values);
  }
  for (let i = 0; i < angles.length; i++) {
    depth.push(angles[i].depth);
    zenit.push(angles[i].zenit);
    azimut.push(angles[i].azimut);
  }

  // const editAB = () => {
  //   setAB(() => {
  //     let a = 0;
  //     let b = angles.length;
  //     if (specificPoints >= 0) {
  //       if (specificPoints - 30 < 0) {
  //         a = 0;
  //         b = 30;
  //       } else if (specificPoints + 30 > angles.length) {
  //         a = angles.length - 30;
  //         b = angles.length;
  //       } else {
  //         a = specificPoints - 15;
  //         b = specificPoints + 15;
  //       }
  //     }
  //     return [a, b];
  //   });
  // };

  const handleClick = (index) => {
    setSpecificPoints((prev) => {
      if (prev === index) {
        let btns = document.getElementsByClassName("btn-navbar");
        btns[prev].classList.remove("btn-clicked");
        setAB([0, angles.length]);
        return -1;
      } else {
        let btns = document.getElementsByClassName("btn-navbar");
        if (prev !== -1) {
          btns[prev].classList.toggle("btn-clicked");
        }
        btns[index].classList.add("btn-clicked");
        setAB(() => {
          let a = 0;
          let b = angles.length;
          if (index >= 0) {
            if (index - pointsCount < 0) {
              a = 0;
              b = pointsCount;
            } else if (index + pointsCount > angles.length) {
              a = angles.length - pointsCount;
              b = angles.length;
            } else {
              a = index - pointsCount/2;
              b = index + pointsCount/2;
            }
          }
          return [a, b];
        });
        return index;
      }
    });
    // console.log("before edit ab", index, ab);
    // editAB();
    // console.log("after", index, ab);

    // console.log(index, specificPoints, ab);
  };

  const changeCheckbox = (index) => {
    setMethods((prev) => {
      let m = prev;
      m[index] = (m[index] + 1) % 2;

      let btns = document.getElementsByClassName("btn-navbar-method");
      if (m[index] === 0) {
        btns[index].classList.remove("btn-clicked");
      } else {
        btns[index].classList.add("btn-clicked");
      }
      setAB((prev) => {return [prev[0], prev[1]]})
      return m;
    });
    
  };
  const onClickSubmit = () => {
    setPointsCount(() => {
      let value = document.getElementById("pointsCount").value;
      if (value) {
        setAB(() => {
          let a = 0;
          let b = angles.length;
          if (specificPoints >= 0) {
            if (specificPoints - parseInt(value) < 0) {
              a = 0;
              b = parseInt(value);
            } else if (specificPoints + parseInt(value) > angles.length) {
              a = angles.length - parseInt(value);
              b = angles.length;
            } else {
              a = specificPoints - parseInt(value)/2;
              b = specificPoints + parseInt(value)/2;
            }
          }
          return [a, b];
        });
        return parseInt(value);
      }
    });
  };
  
  const onClickAspectMode = (type) => {
    setAspectMode((prev1) => {
        if (prev1 != type) {
          document.getElementById(prev1).classList.remove("btn-clicked")
          document.getElementById(type).classList.add("btn-clicked")
        } 
        setAB((prev) => {
          return prev;
        });
        return type;
    });
  };
  
  const onClickProjection = (type) => {
    setProjection((prev1) => {
        if (prev1 != type) {
          document.getElementById(prev1).classList.remove("btn-clicked")
          document.getElementById(type).classList.add("btn-clicked")
        } 
        setAB((prev) => {
          return prev;
        });
        return type;
    });
  };

  const onClickDownload = async () => {
      const response = await fetch("http://127.0.0.1:5000/download_template_tool");
      return 200;
      // const data_angles = await response_angles.json();
  };

  const minimum_curvature_method = {
    x: x_values.slice(ab[0], ab[1]),
    y: y_values.slice(ab[0], ab[1]),
    z: z_values.slice(ab[0], ab[1]),
    name: 'Minimum Curvature Method',
    type: "scatter3d",
    mode: "lines+markers",

    // hovertemplate: '<i>Price</i>: $%{y:.2f}' +
    //                     '<br><b>X</b>: %{x}<br>' +
    //                     `<b>${text}</b>`,
    // autocolorscale: true,
    line: {
      width: 6,
      color: "#99badd",
      // color: z_values,
      // colorscale: [
      //   ["0.0", "#1e90ff"],
      //   ["1.0", "#99badd"],
      // ],
    },
    marker: {
      size: 4,
      color: "#1e90ff",
      // color: z_values,
      // colorscale: [
      //   ["0.0", "#1e90ff"],
      //   ["1.0", "#99badd"],
      // ],
    },
  };

  const radius_of_curvature_method = {
    x: x_values_rocm.slice(ab[0], ab[1]),
    y: y_values_rocm.slice(ab[0], ab[1]),
    z: z_values_rocm.slice(ab[0], ab[1]),
    name: 'Radius of Curvature Method',
    type: "scatter3d",
    mode: "lines+markers",
    // autocolorscale: true,
    line: {
      width: 6,
      color: "#DE9999",
      // color: z_values_rocm,
      // colorscale: [
      //   ["0.0", "#ff1e1e"],
      //   ["1.0", "#dd9999"],
      // ],
    },
    marker: {
      size: 4,
      color: "#FF1F1F",
      // color: z_values_rocm,
      // colorscale: [
      //   ["0.0", "#ff1e1e"],
      //   ["1.0", "#dd9999"],
      // ],
    },
  };

  const balanced_tangential_method = {
    x: x_values_btm.slice(ab[0], ab[1]),
    y: y_values_btm.slice(ab[0], ab[1]),
    z: z_values_btm.slice(ab[0], ab[1]),
    name: 'Balanced Tangential Method',
    type: "scatter3d",
    mode: "lines+markers",
    // autocolorscale: true,
    line: {
      width: 6,
      // color: z_values_btm,
      color: "#AEDE99",
      // colorscale: [
      //   ["0.0", "#9edd99"],
      //   ["1.0", "#1eff29"],
      // ],
    },
    marker: {
      size: 4,
      // color: z_values_btm,
      color: "#4FFF1F",
      // colorscale: [
      //   ["0.0", "#9edd99"],
      //   ["1.0", "#1eff29"],
      // ],
    },
  };

  const average_angles_method = {
    x: x_values_aam.slice(ab[0], ab[1]),
    y: y_values_aam.slice(ab[0], ab[1]),
    z: z_values_aam.slice(ab[0], ab[1]),
    name: 'Average Angles Method',
    type: "scatter3d",
    mode: "lines+markers",
    // autocolorscale: true,
    line: {
      width: 6,
      color: "#C999DE",
      // color: z_values_aam,
      // colorscale: [
      //   ["0.0","rgb(200, 153, 221)"],
      //   ["1.0","rgb(176, 30, 255)"],
      // ],
    },
    marker: {
      size: 4,
      color: "#A51FFF",
      // color: z_values_aam,
      // colorscale: [
      //   ["0.0", "rgb(200, 153, 221)"],
      //   ["1.0", "rgb(176, 30, 255)"],
      // ],
    },
  };

  const adaptive_trajectory_method = {
    x: x_values_atm.slice(ab[0], ab[1]),
    y: y_values_atm.slice(ab[0], ab[1]),
    z: z_values_atm.slice(ab[0], ab[1]),
    name: 'adaptive_trajectory_method',
    type: "scatter3d",
    mode: "lines+markers",
    // autocolorscale: true,
    line: {
      width: 6,
      color: "#DEC299"
      // color: z_values_aam,
      // colorscale: [
      //   ["0.0","rgb(200, 153, 221)"],
      //   ["1.0","rgb(176, 30, 255)"],
      // ],
    },
    marker: {
      size: 4,
      color: "#FFA91F",
      // color: z_values_aam,
      // colorscale: [
      //   ["0.0", "rgb(200, 153, 221)"],
      //   ["1.0", "rgb(176, 30, 255)"],
      // ],
    },
  };

  const methodsList = [
    "minimum_curvature_method",
    "balanced_tangential_method",
    "adaptive_trajectory_method",
    "radius_of_curvature_method",
    "average_angles_method",
    
  ];

  // console.log("***", minimum_curvature_method)

  let all_data_plots_2d_xy = [
    {
      x: x_values.slice(ab[0], ab[1]),
      y: y_values.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "#1e90ff",
      },
      marker: {
        size: 6,
        color: "#99badd",
      },
    },
    {
      x: x_values_btm.slice(ab[0], ab[1]),
      y: y_values_btm.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "#4FFF1F",
      },
      marker: {
        size: 6,
        color: "#AEDE99",
      },
    },
    {
      x: x_values_atm.slice(ab[0], ab[1]),
      y: y_values_atm.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "#FFA91F",
      },
      marker: {
        size: 6,
        color: "#DEC299",
      },
    },
    {
      x: x_values_rocm.slice(ab[0], ab[1]),
      y: y_values_rocm.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "#FF1F1F",
      },
      marker: {
        size: 6,
        color: "#DE9999",
      },
    },
    
    {
      x: x_values_aam.slice(ab[0], ab[1]),
      y: y_values_aam.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "#A51FFF",
      },
      marker: {
        size: 6,
        color: "#C999DE",
      },
    },
    
  ];



  let all_data_plots_2d_xz = [
    {
      x: x_values.slice(ab[0], ab[1]),
      y: z_values.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "#1e90ff",
      },
      marker: {
        size: 6,
        color: "#99badd",
      },
    },
    {
      x: x_values_btm.slice(ab[0], ab[1]),
      y: z_values_btm.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "#4FFF1F",
      },
      marker: {
        size: 6,
        color: "#9edd99",
      },
    },
    {
      x: x_values_atm.slice(ab[0], ab[1]),
      y: z_values_atm.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "FFA91F",
      },
      marker: {
        size: 6,
        color: "DEC299",
      },
    },
    {
      x: x_values_rocm.slice(ab[0], ab[1]),
      y: z_values_rocm.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "#ff1e1e",
      },
      marker: {
        size: 6,
        color: "#DE9999",
      },
    },
    
    {
      x: x_values_aam.slice(ab[0], ab[1]),
      y: z_values_aam.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "rgb(176, 30, 255)",
      },
      marker: {
        size: 6,
        color: "C999DE",
      },
    },
    
  ];



  let all_data_plots_2d_yz = [
    {
      x: y_values.slice(ab[0], ab[1]),
      y: z_values.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "#1e90ff",
      },
      marker: {
        size: 6,
        color: "#99badd",
      },
    },
    {
      x: y_values_btm.slice(ab[0], ab[1]),
      y: z_values_btm.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "#4FFF1F",
      },
      marker: {
        size: 6,
        color: "#9edd99",
      },
    },
    {
      x: y_values_atm.slice(ab[0], ab[1]),
      y: z_values_atm.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "FFA91F",
      },
      marker: {
        size: 6,
        color: "DEC299",
      },
    },
    {
      x: y_values_rocm.slice(ab[0], ab[1]),
      y: z_values_rocm.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "#ff1e1e",
      },
      marker: {
        size: 6,
        color: "#DE9999",
      },
    },
    
    {
      x: y_values_aam.slice(ab[0], ab[1]),
      y: z_values_aam.slice(ab[0], ab[1]),
      type: "scatter",
      mode: "lines+markers",
      line: {
        width: 3,
        color: "rgb(176, 30, 255)",
      },
      marker: {
        size: 6,
        color: "C999DE",
      },
    },
   
  ];

  const all_data_plots_3d = [
    minimum_curvature_method,
    balanced_tangential_method,
    adaptive_trajectory_method,
    radius_of_curvature_method,
    average_angles_method,
  ];

  let data_plots_2d_xy = [];
  let data_plots_2d_xz = [];
  let data_plots_2d_yz = [];
  let data_plots_3d = [];
  methods.forEach((element, i) => {
    if (element === 1) {
      data_plots_2d_xy.push(all_data_plots_2d_xy[i]);
      data_plots_2d_xz.push(all_data_plots_2d_xz[i]);
      data_plots_2d_yz.push(all_data_plots_2d_yz[i]);
      data_plots_3d.push(all_data_plots_3d[i]);
    }
  });

  console.log("w", document.getElementsByClassName("navbar").width);

  return (
    <>
      <div className="app">
        <div className="section navbar" id='navbar' width={width/5} height={height}>
          <div className="back">
            <NavLink to="/start">
              <button className="download-btn">
                <div className="download-btn-img">
                  <img src={arrowimg} alt="" />
                </div>
                <div className="download-btn-text">
                  <p>Back To Start Page</p>
                </div>
              </button>
            </NavLink>
          </div>
          <div className="nav-method">
            <NavMethod changeCheckbox={changeCheckbox} />
          </div>
          <div>
          <div className={"subtitle"}>
              <div>Data ({angles.length} points)</div>
            </div>
            <div className={"btn-opacity25"}>
              <div></div>
              <div>Depth</div>
              <div>Zenit</div>
              <div>Azimut</div>
            </div>
          </div>
          
          
          <div className="nav-data">
            
            <Navbar
              depth={depth}
              zenit={zenit}
              azimut={azimut}
              handleClick={handleClick}
            />
          </div>
          
          <div className="parameters">
            <div className="subtitle">Parameters</div>
            <div className="pointsCount-section">
              <label className="subtitle-2">Points Visible:</label>
              <input type="text" className="pointsCount" id="pointsCount" name="pointsCount" title="Number of Points"/>
              <button type="submit" className="btn-small" onClick={() => onClickSubmit()}>submit</button>
            </div>
            <div className="subtitle-2-1">Aspectmode:</div>
            <div className="aspectmode-btn-section">
              <button className="btn-small aspectmode-btn btn-clicked" id="auto" onClick={() => onClickAspectMode("auto")}>auto</button>
              <button className="btn-small aspectmode-btn" id="data" onClick={() => onClickAspectMode("data")}>data</button>
              <button className="btn-small aspectmode-btn" id="cube" onClick={() => onClickAspectMode("cube")}>cube</button>
            </div>
            <div className="subtitle-2-1">Projection:</div>
            <div className="projection-btn-section">
              <button className="btn-small projection-btn btn-clicked" id="perspective" onClick={() => onClickProjection("perspective")}>perspective</button>
              <button className="btn-small projection-btn" id="orthographic" onClick={() => onClickProjection("orthographic")}>orthographic</button>
            </div>
          </div>
          <div className="download">

          <a href="/backend/uploads/dls.csv" download="data.csv">
            <button className="download-btn">
              <div className="download-btn-img">
                <img src={fileimg} />
              </div>
              <div className="download-btn-text">
                <p>Download The File</p>
              </div>
            </button>
            </a>

          </div>
        </div>
        {/* <div className="section" id="1"></div> */}
        <div className="section" id="second">
          {/* <ExampleChart width={width} height={height/10*9} showControls={false} /> */}
          <Plot3D
            // width={width / 5 > 250 ? (width / 5) * 3 : ((width - 250) / 5) * 3}
            width={(width-300)/4*3-20}
            height={height/4*3+60}
            x_values={x_values.slice(ab[0], ab[1])}
            y_values={y_values.slice(ab[0], ab[1])}
            z_values={z_values.slice(ab[0], ab[1])}
            data_plots={data_plots_3d}
            methods={methods}
            aspectmode={aspectMode}
            projection={projection}
          />
          {/* <AxisLeft /> */}
        </div>

        <div className="section" id="fourth">
          <Plot2DAngle
            width={(width-300)/3}
            height={height / 4}
            type={"Zenit(Depth)"}
            x_values={depth.slice(ab[0], ab[1])}
            y_values={zenit.slice(ab[0], ab[1])}
          />
          <Plot2DAngle
            width={(width-300)/3}
            height={height / 4}
            type={"Azimut(Depth)"}
            x_values={depth.slice(ab[0], ab[1])}
            y_values={azimut.slice(ab[0], ab[1])}
          />
        </div>

        <div className="section" id="third">
          <Plot2D
            // width={width / 5 > 250 ? width / 5 : (width - 250) / 5}
            width={(width-300)/4}
            height={height / 3}
            type={"xy"}
            x_values={x_values.slice(ab[0], ab[1])}
            y_values={y_values.slice(ab[0], ab[1])}
            z_values={z_values.slice(ab[0], ab[1])}
            data_plots={data_plots_2d_xy}
          />
          <Plot2D
            // width={width / 5 > 250 ? width / 5 : (width - 250) / 5}
            width={(width-300)/4}
            height={height/3}
            type={"xz"}
            x_values={x_values.slice(ab[0], ab[1])}
            y_values={y_values.slice(ab[0], ab[1])}
            z_values={z_values.slice(ab[0], ab[1])}
            data_plots={data_plots_2d_xz}
          />
          <Plot2D
            // width={width / 5 > 250 ? width / 5 : (width - 250) / 5}
            width={(width-300)/4}
            height={height / 3}
            type={"yz"}
            x_values={x_values.slice(ab[0], ab[1])}
            y_values={y_values.slice(ab[0], ab[1])}
            z_values={z_values.slice(ab[0], ab[1])}
            data_plots={data_plots_2d_yz}
          />
        </div>
        
        
        {window.addEventListener("resize", () => {
          let width = window.innerWidth;
          let height = window.innerHeight;
          setWidth(width);
          setHeight(height);

          // methodsList.forEach((element, i) => {
          //   const checkbox = document.querySelector(`#${element}`);
          //   checkbox.addEventListener("change", () => {
          //     if (checkbox.checked) {
          //       methods[i] = 1;
          //     } else {
          //       methods[i] = 0;
          //     }
          //   });
          // });
        })}
      </div>
    </>
  );
};

export default App;
