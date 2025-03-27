import * as d3 from "d3";
import React, { useRef, useState, useEffect } from "react";

const Line = (props) => {
  // const width = 640;
  // const height = 400;


  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
      const handleResize = () => {
          setWindowSize({
              width: window.innerWidth,
              height: window.innerHeight,
          });
      };

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
      <svg width={windowSize.width * 0.8} height={windowSize.height * 0.8}>
          <circle cx="50%" cy="50%" r="40" fill="blue" />
      </svg>
  );
  };















  
  let w = document.body.clientWidth;
  let h = document.body.clientHeight;

  

  let width = (w/4>50) ? w/5*3 : (w-50)/4*3;
  let height = h*2/3;
  const padding = 20;
  // console.log("=>")
  // console.log(typeof(props))
  // console.log(Object.values(props)[0])
  console.log("=>")
  console.log(document.body.clientWidth)
  console.log("=>")


  // var x_values = [1, 3, 5, 9, 15];
  // var y_values = [1, 2, 3, 4, 5];
  // const data = [];
  // for (let i = 0; i < x_values.length; i++) {
  //   data.push({ x: x_values[i], y: y_values[i] });
  // }
  const data = Object.values(props)[0];
  const x_values = data.map((e)=>{return e[0]})
  const y_values = data.map((e)=>{return e[1]})
  console.log(y_values);
  console.log(d3.extent(y_values));
  console.log("=>")

  

 
  const xScale = d3.scaleLinear([0, 15], [padding, width - padding]);
  const yScale = d3.scaleLinear([0, 5], [padding, height - padding]);
  const line = d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]));

  const gx = useRef();
  useEffect(() => void d3.select(gx.current).call(d3.axisTop(xScale).ticks(5)), [gx, xScale]);
  const gy = useRef();
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(yScale).ticks(5)), [gy, yScale]);


  return (
    <svg className="svg-plot" id="svg-plot" width={width} height={height}>
      <path
        fill="none"
        stroke="black"
        // strokeWidth="1.5"
        d={line(data)}
      />
      <g fill="white" stroke="black" data={data}>
        {data.map((d, i) => (
          <circle key={i} cx={xScale(d[0])} cy={yScale(d[1])} r="5" />
        ))}
      </g>
      <g ref={gx} className="axis" transform={`translate(0,${padding})`} />
      <g ref={gy} className="axis" transform={`translate(${padding})`} />
      <script type="text/javascript">
        {window.addEventListener('resize',() => {
          // let width = document.clientWidth;
          // w = width;
          let w = document.body.clientWidth;
          let h = document.body.clientHeight;
          let width = (w/4>50) ? w/5*3 : (w-50)/4*3;
          let height = h*2/3;

          console.log(w, h)
          const getSvg = document.querySelector(".svg-plot");
          let svg = d3.select("#svg-plot").attr("width", width).attr("height", height)
          // getSvg.width = width;
          // getSvg.height = height;
        })}
      </script>
    </svg>
  );
};

export default Line;
