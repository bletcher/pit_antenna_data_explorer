import * as Plot from "../../_npm/@observablehq/plot@0.6.14/_esm.js";

export function tagsOverTime(data, {width}) {
  return Plot.plot({
    title: "By survey type",
    width,
  //x: { type: "utc" },
  //x: { round: true, nice: d3.utcMonth },
    marks: [
      Plot.dot(data, {
        x: "newDate",
        y: "riverMeter",
        stroke: "tag",
        symbol: "survey",
        fx: "riverOrdered"
      }),
      Plot.line(data, {
        x: "newDate",
        y: "riverMeter",
        stroke: "tag",
        fx: "riverOrdered"
      }),
      Plot.axisX({ ticks: "3 months" })
    ],
    // Include a legend for the color channel
    color: {
      legend: true
    },
    symbol: {
      legend: true
    }
  })
}

export function tagsOverTimeRiver(data, {width}) {
  return Plot.plot({
    title: "By river",
    width,
    marks: [
      Plot.dot(data, {
        x: "newDate",
        y: "riverMeter",
        stroke: "tag",
        symbol: "riverOrdered"
      }),
      Plot.line(data, { x: "newDate", y: "riverMeter", stroke: "tag" }),
      Plot.axisX({ ticks: "3 months" })
    ],
    // Include a legend for the color channel
    color: {
      legend: true
    },
    symbol: {
      legend: true
    }
  })
}