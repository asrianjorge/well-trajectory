import React, { useState, useEffect, useMemo } from "react";
import { extent, max } from "@visx/vendor/d3-array";
import * as allCurves from "@visx/curve";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import {
  MarkerArrow,
  MarkerCross,
  MarkerX,
  MarkerCircle,
  MarkerLine,
} from "@visx/marker";
import generateDateValue, {
  DateValue,
} from "@visx/mock-data/lib/generators/genDateValue";
import axios from "axios";
import AreaClosed from "@visx/shape/lib/shapes/AreaClosed";
import { curveMonotoneX } from "@visx/curve";
import {
  scaleTime,
  scaleUtc,
  scaleLinear,
  scaleLog,
  scaleBand,
  ScaleInput,
  coerceNumber,
} from "@visx/scale";
import { Axis, Orientation, SharedAxisProps, AxisScale } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import {
  AnimatedAxis,
  AnimatedGridRows,
  AnimatedGridColumns,
} from "@visx/react-spring";
import { getSeededRandom } from "@visx/mock-data";
import { LinearGradient } from "@visx/gradient";
import { timeFormat } from "@visx/vendor/d3-time-format";
import { GridRowsProps } from "@visx/grid/lib/grids/GridRows";
import { GridColumnsProps } from "@visx/grid/lib/grids/GridColumns";

// axisLeft
// axisTop
// curve
// controls (*)
type CurveType = keyof typeof allCurves;

export type CurveProps = {
  width: number;
  height: number;
  showControls?: boolean;
};

export type AxisProps = {
  width: number;
  height: number;
  showControls?: boolean;
};

// interface AxisDemoProps<Scale extends AxisScale>
//     extends SharedAxisProps<Scale> {
//     values: ScaleInput<Scale>[];
//   };

export default function CompoundPlot({
  width,
  height,
  showControls = true,
}: CurveProps) {
  const [curveType, setCurveType] = useState<CurveType>("curveNatural");
  const [showPoints, setShowPoints] = useState<boolean>(true);
  const [data, setData] = useState([]);

  const fetchData = () => {
    fetch("http://127.0.0.1:5000/data")
      .then((response) => {
        console.log("response", response.ok);
        return response.json(); // Возвращаем промис для json
      })
      .then((jsonData) => {
        setData(jsonData);
        console.log(jsonData);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных:", error); // Обработка ошибок
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const fetchData2 = async () => {
  //   const response = await fetch("http://127.0.0.1:5000/data");
  //   console.log("response", response.ok)
  //   const jsonData = await response.json();
  //   setData(jsonData);
  //   console.log(jsonData);
  // };
  // useEffect(() => {
  //   fetchData2();
  // }, []);

  const series = new Array();

  data.map((item: { x: []; y: [] }, i) => {
    series.push([item.x, item.y]);
    // console.log(`x: ${item.x}, y: ${item.y}`);
  });
  // console.log("series[0]", series[0]);

  const getX = (array) =>
    Array.isArray(array) && array.length > 0 ? array[0] : undefined;
  const getY = (array) =>
    Array.isArray(array) && array.length > 0 ? array[1] : undefined;

  // scales
  const xScale = scaleLinear<number>({
    domain: [0, max(series, getX) as number],
  });
  const yScale = scaleLinear<number>({
    domain: [0, max(series, getY) as number],
  });

  // update scale output ranges
  // console.log(width, height);
  xScale.range([0, width]);
  yScale.range([height, 0]);

  // AXIS !!!!!!!
  // AXIS !!!!!!!
  // AXIS !!!!!!!

  const tickLabelProps = {
    fill: "#000",
    fontSize: 12,
    fontFamily: "sans-serif",
    textAnchor: "middle",
  } as const;

  const getMinMax = (vals: (number | { valueOf(): number })[]) => {
    const numericVals = vals.map(coerceNumber);
    return [Math.min(...numericVals), Math.max(...numericVals)];
  };

  const getExtentX = (array) => {
    if (Array.isArray(array) && array.length > 0) {
      // console.log(array);
      let minmax = new Array<number>(2);
      // it's much easier
      minmax = [array[0][0], array[array.length - 1][0]];
      // it's much easier

      // minmax = [10000, -1];
      // for (let i=0; i<array.length; i++) {
      //   if (array[i][0] > minmax[1]) minmax[1] = array[i][0];
      //   if (array[i][0] < minmax[0]) minmax[0] = array[i][0];
      // };
      // console.log("getExtentX", minmax);
      return minmax;
    } else {
      return [undefined, undefined];
    }
  };

  const getExtentY = (array) => {
    // console.log(array);
    let minmax = new Array<number>(2);
    minmax = [10000, -1];
    for (let i = 0; i < array.length; i++) {
      if (array[i][1] > minmax[1]) minmax[1] = array[i][1];
      if (array[i][1] < minmax[0]) minmax[0] = array[i][1];
    }
    // console.log("getExtentY", minmax);
    return minmax;
  };

  // console.log("***");
  // console.log(getExtentY(series));

  type AnimationTrajectory = "outside" | "center" | "min" | "max" | undefined;

  type AxisComponentType = React.FC<
    SharedAxisProps<AxisScale> & {
      animationTrajectory: AnimationTrajectory;
    }
  >;
  type GridRowsComponentType = React.FC<
    GridRowsProps<AxisScale> & {
      animationTrajectory: AnimationTrajectory;
    }
  >;
  type GridColumnsComponentType = React.FC<
    GridColumnsProps<AxisScale> & {
      animationTrajectory: AnimationTrajectory;
    }
  >;

  // use non-animated components if prefers-reduced-motion is set
  const prefersReducedMotionQuery =
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduceqd-motion: reduce)");
  const prefersReducedMotion =
    !prefersReducedMotionQuery || !!prefersReducedMotionQuery.matches;
  const [useAnimatedComponents, setUseAnimatedComponents] = useState(
    !prefersReducedMotion
  );

  // in svg, margin is subtracted from total width/height
  // const width = outerWidth - margin.left - margin.right;
  // const height = outerHeight - margin.top - margin.bottom;
  const [dataToggle, setDataToggle] = useState(true);
  const [animationTrajectory, setAnimationTrajectory] =
    useState<AnimationTrajectory>("center");

  // define some types
  interface AxisDemoProps<Scale extends AxisScale>
    extends SharedAxisProps<Scale> {
    values: ScaleInput<Scale>[];
  }

  const AxisComponent: AxisComponentType = useAnimatedComponents
    ? AnimatedAxis
    : Axis;
  const GridRowsComponent: GridRowsComponentType = useAnimatedComponents
    ? AnimatedGridRows
    : GridRows;
  const GridColumnsComponent: GridColumnsComponentType = useAnimatedComponents
    ? AnimatedGridColumns
    : GridColumns;

  const axes: AxisDemoProps<AxisScale<number>>[] = useMemo(() => {
    // const linearValues = dataToggle ? [0, 2, 4, 6, 8, 10] : [6, 8, 10, 12];
    const linearValues = (dataToggle && getExtentX(series)[0]!==undefined)
        ? getExtentX(series)
        : [0, 10];
      console.log("+++", linearValues);
    const linVals = getExtentX(series);
    return [
      {
        scale: scaleLinear({
          domain: linVals,
          range: [0, width-20],
        }),
        values: linVals,
        tickFormat: (
          v: number,
          index: number,
          ticks: { value: number; index: number }[]
        ) => 
          // linVals,
        // [{value: linVals[0], index: 0}, {value: linVals[1], index: 1}],
          index === 0
            ? linVals[0]
            : index === ticks[ticks.length - 1].index
            ? linVals[1]
            : `${v}`,
        label: "linear",
      },
    ];
  }, [dataToggle, width]);

  // if (width < 10) return null;

  const scalePadding = 20;
  const scaleHeight = height / axes.length - scalePadding;

  // const yScale = scaleLinear({
  //   domain: [100, 0],
  //   range: [scaleHeight, 0],
  // });

  // RETURN !!!!!!
  // RETURN !!!!!!
  // RETURN !!!!!!

  return (
    <div className="visx-curves-demo">
      <svg width={width} height={height}>
        <LinearGradient
          id="visx-axis-gradient"
          from={"#0f308d"}
          to={"#0f308d"}
          toOpacity={0.5}
        />
        <MarkerX
          id="marker-x"
          stroke="#333"
          size={22}
          strokeWidth={4}
          markerUnits="userSpaceOnUse"
        />
        <MarkerCross
          id="marker-cross"
          stroke="#333"
          size={22}
          strokeWidth={4}
          strokeOpacity={0.6}
          markerUnits="userSpaceOnUse"
        />
        <MarkerCircle id="marker-circle" fill="#333" size={2} refX={2} />
        <MarkerArrow
          id="marker-arrow-odd"
          stroke="#333"
          size={8}
          strokeWidth={1}
        />
        <MarkerLine id="marker-line" fill="#333" size={16} strokeWidth={1} />
        <MarkerArrow id="marker-arrow" fill="#333" refX={2} size={6} />
        <rect width={width} height={height} fill="#efefef" rx={14} ry={14} />
        {/* {width > 8 &&
          series.map((lineData, i) => {
            const even = i % 2 === 0;
            let markerStart = even ? 'url(#marker-cross)' : 'url(#marker-x)';
            if (i === 1) markerStart = 'url(#marker-line)';
            const markerEnd = even ? 'url(#marker-arrow)' : 'url(#marker-arrow-odd)';
            return (
              <Group key={`lines-${i}`} top={i * lineHeight} left={-50}>
                {showPoints &&
                  series.map((d, j) => (
                    <circle
                      key={i + j}
                      r={3}
                      cx={xScale(getX(d))}
                      cy={yScale(getY(d))}
                      stroke="rgba(33,33,33,0.5)"
                      fill="transparent"
                    />
                  ))}
                <LinePath<DateValue>
                  curve={allCurves[curveType]}
                  data={series}
                  x={(d) => xScale(getX(d)) ?? 0}
                  y={(d) => yScale(getY(d)) ?? 0}
                  stroke="#333"
                  strokeWidth={even ? 2 : 1}
                  strokeOpacity={even ? 0.6 : 1}
                  shapeRendering="geometricPrecision"
                  markerMid="url(#marker-circle)"
                  markerStart={markerStart}
                  markerEnd={markerEnd}
                />
              </Group>
            );
          })} */}
        {
          <Group key={`lines`} top={50} left={-50}>
            {showPoints &&
              series.map((d, j) => (
                <circle
                  key={j}
                  r={3}
                  cx={xScale(getX(d))}
                  cy={yScale(getY(d))}
                  stroke="rgba(33,33,33,0.5)"
                  fill="transparent"
                />
              ))}
            <LinePath<DateValue>
              curve={allCurves[curveType]}
              data={series}
              x={(d) => xScale(getX(d)) ?? 0}
              y={(d) => yScale(getY(d)) ?? 0}
              stroke="#333"
              strokeWidth={1}
              strokeOpacity={0.6}
              shapeRendering="geometricPrecision"
              markerMid="url(#marker-circle)"
              markerStart="url(#marker-circle)"
              markerEnd="url(#marker-circle)"
            />
          </Group>
        }

        <g transform={`translate(${10},${10})`}>
          {axes.map(({ scale, values, label, tickFormat }, i) => (
            <g
              key={`scale-${i}`}
              transform={`translate(0, ${i * (scaleHeight + scalePadding)})`}
            >
              <GridRowsComponent
                // force remount when this changes to see the animation difference
                key={`gridrows-${animationTrajectory}`}
                scale={xScale}
                stroke={"#6e0fca"}
                width={width - 20}
                numTicks={dataToggle ? 1 : 3}
                animationTrajectory={animationTrajectory}
              />
              <GridColumnsComponent
                // force remount when this changes to see the animation difference
                key={`gridcolumns-${animationTrajectory}`}
                scale={scale}
                stroke={"#6e0fca"}
                height={scaleHeight-20}
                numTicks={dataToggle ? 5 : 2}
                animationTrajectory={animationTrajectory}
              />
              {/* <AreaClosed
                          data={values.map((x) => [
                            (scale(x) ?? 0) +
                              // offset point half of band width for band scales
                              ('bandwidth' in scale && typeof scale!.bandwidth !== 'undefined'
                                ? scale.bandwidth!() / 2
                                : 0),
                            yScale(10 + seededRandom() * 90),
                          ])}
                          yScale={yScale}
                          curve={curveMonotoneX}
                          fill={gridColor}
                          fillOpacity={0.2}
                        /> */}
              <AxisComponent
                // force remount when this changes to see the animation difference
                key={`axis-${animationTrajectory}`}
                orientation={Orientation.bottom}
                top={scaleHeight-20}
                scale={scale}
                tickFormat={tickFormat}
                stroke={"#6e0fca"}
                tickStroke={"#6e0fca"}
                tickLabelProps={tickLabelProps}
                tickValues={
                  values
                }
                numTicks={label === "time" ? 6 : undefined}
                label={label}
                labelProps={{
                  x: width + 30,
                  y: -10,
                  fill: "#6e0fca",
                  fontSize: 18,
                  strokeWidth: 0,
                  stroke: "#fff",
                  paintOrder: "stroke",
                  fontFamily: "sans-serif",
                  textAnchor: "start",
                }}
                animationTrajectory={animationTrajectory}
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
