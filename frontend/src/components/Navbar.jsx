import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const Navbar = (props) => {
  const [data, setData] = useState({
    x_values: [],
    y_values: [],
    z_values: [],
  });

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

  for (let i = 0; i < data.length; i++) {
    // console.log(i, data[i])
    x_values.push(data[i].x_values.toFixed(2));
    y_values.push(data[i].y_values.toFixed(2));
    z_values.push(-data[i].z_values.toFixed(2));
  }

  return (
    <div>
        <button className={"btn-navbar opacity25"}>
          <div></div>
          <div>X</div>
          <div>Y</div>
          <div>Z</div>
        </button>
      {x_values.map((d, i) => (
        <button key={i} id={i} className={"btn-navbar"}>
          <div className="opacity25">{i}</div>
          <div>{d}</div>
          <div>{y_values[i]}</div>
          <div>{z_values[i]}</div>
        </button>
      ))}
    </div>
  );
};
export default Navbar;
