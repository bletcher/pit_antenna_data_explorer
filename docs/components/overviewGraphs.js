import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
//import {select} from "d3-selection";
import {groupSort} from "npm:d3";
import { timeFormat } from 'd3-time-format';

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
    height: 550,
    marginTop: 40,
    marginLeft: 50,
    marginright: 120,
    y: {grid: true, label: "Counts"},
    x: {label: "Year", labelFontSize: 16},
    color: {...color, legend: true},
    marks: [
      //Plot.rectX(data, Plot.groupY({x: "count"}, {y: "year", fill: "survey", tip: true, fx: "river", fy: "species"})),
      Plot.rectY(data, Plot.groupX({y: "count"}, {x: "year", fill: "survey", tip: true, fy: "river", fx: "species"})),
      Plot.ruleY([0])
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

export function plotSelectedByInd2(dataIn, surveySet, rangeHeight, {width}) {
  const colorScale = Plot.scale({
    color: {
      type: "categorical",
      domain: groupSort(dataIn, (D) => -D.length, (d) => d.tag),
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
      Plot.dot(dataIn, {
        x: "detectionDate", y: "riverMeter", stroke: "tag", symbol: "survey", tip: true,
        r: (d) => d.observedLength === "NA" ? 12 : d.observedLength,
        fy: "cohort", fx: "riverOrdered"
      }),
      Plot.line(dataIn.filter(d => d.tag !== "untagged"), {
        x: "detectionDate", y: "riverMeter", stroke: "tag",
        fy: "cohort", fx: "riverOrdered"
      }),
      Plot.line(dataIn.filter(d => d.tag !== "untagged"), Plot.pointer({
        x: "detectionDate", y: "riverMeter", stroke: "tag",
        fy: "cohort", fx: "riverOrdered", strokeWidth: 20
      }))
    ]
  });
}
export function plotSelectedByInd3(dataIn, surveySet, rangeHeight, {width}) {
  const colorScale = Plot.scale({
    color: {
      type: "categorical",
      domain: groupSort(dataIn, (D) => -D.length, (d) => d.tag),
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

  const formatDate = timeFormat("%Y-%m-%d");
  
  const plot = Plot.plot({
    title: "Filtered dataset",
    width,
    height: rangeHeight,
    x: {grid: true, label: "Date"},
    color: {...colorScale, legend: false},
    symbol: {...symbolScale, legend: true},
    r: {domain: [0, 400], legend: true}, // domain doesn't seem to work
    marks: [
      Plot.dot(dataIn, {
        x: "detectionDate", y: "riverMeter", stroke: "tag", symbol: "survey", 
        //tip: true,
        r: (d) => d.observedLength === "NA" ? 12 : d.observedLength,
        fy: "cohort", fx: "riverOrdered"
      }),
      Plot.line(dataIn.filter(d => d.tag !== "untagged"), {
        x: "detectionDate", y: "riverMeter", stroke: "tag",
        fy: "cohort", fx: "riverOrdered"
      }),
      Plot.text(dataIn, 
        Plot.pointerX({
          px: "detectionDate", 
          py: "riverMeter", 
          dy: -56, dx: -38, 
          frameAnchor: "top-left", 
          fontVariant: "tabular-nums", 
          text: (d) => [`Date ${formatDate(new Date(d.detectionDate))}`, `tag = ${d.tag}`].join("   ")
      })),
      Plot.axisX({fontSize: "15px"}),
      Plot.axisY({fontSize: "13px"})
    ]
  });
/*
  d3.select(plot)
    .selectAll("path")
    .on("mouseover", function (event, d) {
      /*const index = d3.select(this).datum();
      const tag = dataIn[index].tag;
      const d2 = dataIn.filter(d => d.tag === tag);
      
      console.log("Tag index:", index, event.target.__data__); // Print the tag value to the console
      console.log("Tag:", dataIn[index].tag, d2); // Print the tag value to the console
      console.log("event", event.currentTarget);

      const e =   d3.select(plot)
      .selectAll("path").nodes();
      const i = e.indexOf(this);
      console.log("die", d, i);
      
      d3.select(plot).selectAll("path")
        .attr("opacity", 0.2); // Dim all lines

      // tried to select all tags with the same tag value, but couldn't get that to work
      // the plot.dot elements are `paths` as well as the plot.line elements  
      d3.select(this)
        //.filter(function() {
        //  const pathIndex = d3.select(this).datum();
        //  return dataIn[pathIndex].tag === tag;
        //})
        .attr("opacity", 1)
        .attr("stroke-width", 5); // Highlight the line with the same tag
    });

  d3.select(plot)
    .on("mouseout", function () {
      d3.select(plot).selectAll("path")
        .attr("opacity", 1) // Reset opacity for all lines
        .attr("stroke-width", 1); // Reset line width for all lines
    });
*/

  d3.select(plot)
    .selectAll("path")
    .on("mouseover", function () {
      d3.select(plot).selectAll("path").attr("opacity", 0.2);
      d3.select(this).attr("opacity", 1);
    });
  d3.select(plot).on("mouseout", function () {
    d3.select(plot).selectAll("path").attr("opacity", 1);
  });

  return plot;
}