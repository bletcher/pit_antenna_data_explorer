import * as Plot from "../../_npm/@observablehq/plot@0.6.14/_esm.js";
//import * as d3 from "npm:d3";
import {groupSort} from "../../_npm/d3@7.9.0/_esm.js";

export function barChartOverview(data, {width}) {
  const color = Plot.scale({
    color: {
      type: "categorical",
      domain: groupSort(data, (D) => -D.length, (d) => d.survey).filter((d) => d !== "Other"),
      unknown: "var(--theme-foreground-muted)"
    }
  });

  return Plot.plot({
    title: "Counts by river, survey type and species",
    width,
    height: 750,
    marginTop: 40,
    marginLeft: 50,
    marginright: 120,
    x: {grid: true, label: "Counts"},
    y: {label: null},
    color: {...color, legend: true},
    marks: [
      Plot.rectX(data, Plot.groupY({x: "count"}, {y: "year", fill: "survey", tip: true, fx: "river", fy: "species"})),
      Plot.ruleX([0])
    ]
  });
}

export function plotSelectedByInd(data, surveySet, rangeHeight, {width}) {
  const colorScale = Plot.scale({
    color: {
      type: "categorical",
      domain: groupSort(data, (D) => -D.length, (d) => d.tag),
      unknown: "var(--theme-foreground-muted)"
    }
  });

  const symbolScale = Plot.scale({
    symbol: {
      type: "categorical",
      domain: surveySet,
      unknown: "var(--theme-foreground-muted)"
    }
  });

/*
  const rScale = Plot.scale({
    r: {
      type: "linear",
      domain: [0,400],
      unknown: "var(--theme-foreground-muted)"
    }
  });
*/
  return Plot.plot({
    title: "Filtered dataset",
    width,
    height: rangeHeight,

    x: {grid: true, label: "Date"},
    //y: {label: null},
    color: {...colorScale, legend: false},
    symbol: {...symbolScale, legend: true},
    r: {domain: [0,400], legend: true}, //domain doesn't seem to work
    marks: [
      Plot.dot(data, {
        x: "newDate", y: "riverMeter", stroke: "tag", symbol: "survey", tip: true,
        r: (d) => d.observedLength === "NA" ? 12 : d.observedLength,
        fy: "cohort", fx: "riverOrdered"
      }),
      Plot.line(data.filter(d => d.tag !== "untagged"), {
        x: "newDate", y: "riverMeter", stroke: "tag",
        fy: "cohort", fx: "riverOrdered"
      })
    ]
  });
}