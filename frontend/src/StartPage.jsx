import { useEffect, useState } from "react";
// import PlotTest from "./components/PlotTest";
import Plot3D from "./components/Plot3D";
// import Plot2DSystem from "./components/Plot2DSystem";
import Plot2D from "./components/Plot2D";
import Navbar from "./components/Navbar";
// import LinePlot from "./components/PlotTest3";
import "./App.css";
// import Line from "./primitives/Line";
import ExampleChart from "./visx/Chart";
import ExampleAxis from "./visx/Axis";
import CompoundPlot from "./visx/CompoundPlot";
import fileimg from "./icons/file.png";
import { NavLink } from "react-router";
// import { UploadProps, UploadRef } from "./Types";

const Upload = () => (
  <label>
    <input type="file" />
  </label>
);

//-----------------------------------------StartPage

const StartPage = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  // const x = [1, 3, 5, 9, 15];
  // const y = [1, 2, 3, 4, 5];
  // const data = [];
  // for (let i = 0; i < x.length; i++) {
  //   data.push([x[i], y[i]]);
  // }
  const [url, setUrl] = useState();

  return (
    <>
      <div className="startpage">
        <div className="section notifications hidden"></div>
        <div className="section upload-area">
          {/* <div>

          <input
            type="file"
            id="fileElem"
            multiple
            accept="image/*"
            style="display:none" />
          <button id="fileSelect" type="button">Select some files</button>

          <button className="startpage-btn">
          <div>
            <Upload ref={uploadRef} onUpload={setUrl}>
              <img src={url} alt="" />
            </Upload>
            <button onClick={() => uploadRef.current.upload()}>
              Upload Tools File
            </button>
          </div>
            </button>

            </div> */}
          <div>
            <button className="startpage-btn">Upload Inclinometry File</button>
          </div>
          <div>
            <button className="startpage-btn">Upload Inclinometry File</button>
          </div>
          <div>
            <button className="startpage-btn">Download Tools File</button>
          </div>
          <div>
            <button className="startpage-btn">
              Download Inclinometry File
            </button>
          </div>
        </div>
        <div className="section">
          <NavLink to="/main">
            <button className="run-btn">
              {/* <div className="download-btn-text"> */}
              <p>Run</p>
              {/* </div> */}
            </button>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default StartPage;
