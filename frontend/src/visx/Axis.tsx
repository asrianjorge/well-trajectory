import React, { useState, useMemo } from "react";
import AreaClosed from "@visx/shape/lib/shapes/AreaClosed";
import { curveMonotoneX } from "@visx/curve";
import {
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
import ExampleChart from "./Chart";

export const backgroundColor = "white";
const axisColor = "#000";
const tickLabelColor = "#000";
export const labelColor = "#340098";
const gridColor = "#6e0fca";
const seededRandom = getSeededRandom(0.5);
const margin = {
  top: 10,
  right: 20,
  bottom: 10,
  left: 20,
};

const tickLabelProps = {
  fill: tickLabelColor,
  fontSize: 12,
  fontFamily: "sans-serif",
  textAnchor: "middle",
} as const;

const getMinMax = (vals: (number | { valueOf(): number })[]) => {
  const numericVals = vals.map(coerceNumber);
  return [Math.min(...numericVals), Math.max(...numericVals)];
};

export type AxisProps = {
  width: number;
  height: number;
  showControls?: boolean;
};

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

export default function ExampleAxis({
  width: outerWidth = 800,
  height: outerHeight = 800,
  showControls = true,
}: AxisProps) {
  // use non-animated components if prefers-reduced-motion is set
  const prefersReducedMotionQuery =
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion =
    !prefersReducedMotionQuery || !!prefersReducedMotionQuery.matches;
  const [useAnimatedComponents, setUseAnimatedComponents] = useState(
    !prefersReducedMotion
  );

  // in svg, margin is subtracted from total width/height
  const width = outerWidth - margin.left - margin.right;
  const height = outerHeight - margin.top - margin.bottom;
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
    // toggle between two value ranges to demo animation
    const linearValues = dataToggle ? [0, 2, 4, 6, 8, 10] : [6, 8, 10, 12];

    return [
      {
        scale: scaleLinear({
          domain: getMinMax(linearValues),
          range: [0, width],
        }),
        values: linearValues,
        tickFormat: (
          v: number,
          index: number,
          ticks: { value: number; index: number }[]
        ) =>
          index === 0
            ? "first"
            : index === ticks[ticks.length - 1].index
            ? "last"
            : `${v}`,
        label: "linear",
      },
    ];
  }, [dataToggle, width]);

  if (width < 10) return null;

  const scalePadding = 20;
  const scaleHeight = height / axes.length - scalePadding;

  const yScale = scaleLinear({
    domain: [100, 0],
    range: [scaleHeight, 0],
  });

  return (
    <>
      <svg width={outerWidth} height={outerHeight}>
        <LinearGradient
          id="visx-axis-gradient"
          from={backgroundColor}
          to={backgroundColor}
          toOpacity={0.5}
        />
        <rect
          x={0}
          y={0}
          width={outerWidth}
          height={outerHeight}
          fill={"url(#visx-axis-gradient)"}
          rx={14}
        />
        <g transform={`translate(${margin.left},${margin.top})`}>
          {axes.map(({ scale, values, label, tickFormat }, i) => (
            <g
              key={`scale-${i}`}
              transform={`translate(0, ${i * (scaleHeight + scalePadding)})`}
            >
              <GridRowsComponent
                // force remount when this changes to see the animation difference
                key={`gridrows-${animationTrajectory}`}
                scale={yScale}
                stroke={gridColor}
                width={width}
                numTicks={dataToggle ? 1 : 3}
                animationTrajectory={animationTrajectory}
              />
              <GridColumnsComponent
                // force remount when this changes to see the animation difference
                key={`gridcolumns-${animationTrajectory}`}
                scale={scale}
                stroke={gridColor}
                height={scaleHeight}
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
                top={scaleHeight}
                scale={scale}
                tickFormat={tickFormat}
                stroke={axisColor}
                tickStroke={axisColor}
                tickLabelProps={tickLabelProps}
                tickValues={
                  label === "log" || label === "time" ? undefined : values
                }
                numTicks={label === "time" ? 6 : undefined}
                label={label}
                labelProps={{
                  x: width + 30,
                  y: -10,
                  fill: labelColor,
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
      {showControls && (
        <>
          <div style={{ fontSize: 12 }}>
            <label>
              <input
                type="checkbox"
                onChange={() =>
                  setUseAnimatedComponents(!useAnimatedComponents)
                }
                checked={useAnimatedComponents}
              />{" "}
              enable animation
            </label>
            &nbsp;&nbsp;&nbsp;
            {useAnimatedComponents && (
              <>
                <strong>animation trajectory</strong>
                <label>
                  <input
                    type="radio"
                    onChange={() => setAnimationTrajectory("outside")}
                    checked={animationTrajectory === "outside"}
                  />{" "}
                  outside
                </label>
                <label>
                  <input
                    type="radio"
                    onChange={() => setAnimationTrajectory("center")}
                    checked={animationTrajectory === "center"}
                  />{" "}
                  center
                </label>
                <label>
                  <input
                    type="radio"
                    onChange={() => setAnimationTrajectory("min")}
                    checked={animationTrajectory === "min"}
                  />{" "}
                  min
                </label>
                <label>
                  <input
                    type="radio"
                    onChange={() => setAnimationTrajectory("max")}
                    checked={animationTrajectory === "max"}
                  />{" "}
                  max
                </label>
              </>
            )}
          </div>
          {useAnimatedComponents && (
            <button onClick={() => setDataToggle(!dataToggle)}>
              Update scales
            </button>
          )}
        </>
      )}
    </>
  );
}
