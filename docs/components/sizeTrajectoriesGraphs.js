import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
//import {select} from "d3-selection";
import {groupSort} from "npm:d3";
import { timeFormat } from 'd3-time-format';


  export function plotSizeTrajectories(dataIn,  rangeHeight, selectedToolTip, {width}) {
    const colorScale = Plot.scale({
      color: {
        type: "categorical",
        domain: groupSort(dataIn, (D) => -D.length, (d) => d.tag),
        unknown: "var(--theme-foreground-muted)"
      }
    });

  
    const formatDate = timeFormat("%Y-%m-%d");
    
    const plot = Plot.plot({
      //title: "Filtered dataset",
      width,
      height: rangeHeight,
      x: {grid: true, label: "Date"},
      color: {...colorScale, legend: false},
      //symbol: {...symbolScale, legend: true},
      //r: {domain: [0, 400], legend: true}, // domain doesn't seem to work
      marks: [
        Plot.dot(dataIn, {
          x: "detectionDate", y: "observedLength", 
          stroke: "tag", //symbol: "survey", 
          r: 5,
          tip: selectedToolTip ? true : false,
          fy: "cohort", fx: "riverOrdered",
          title: "tag"
        }),
        /*
        Plot.dot(dataIn, 
          Plot.pointer({
          x: "detectionDate", y: "observedLength", 
          stroke: "tag", symbol: "survey", 
          fill: "tag",
          r: 8,
          fy: "cohort", fx: "riverOrdered",
          maxRadius: 8
        })),
        */
        Plot.line(dataIn.filter(d => d.tag !== "untagged"), {
          x: "detectionDate", y: "observedLength", 
          stroke: "tag", //symbol: "survey", 
          fy: "cohort", fx: "riverOrdered",
          title: "tag"
        })
      ]
    });

    let mousedDot = null;

    d3
      .select(plot)
      .selectAll('path, circle')
      .on("mouseover", function () {
          mousedDot = d3.select(this).select("title").text();
          console.log(mousedDot);

          d3.select(plot)
            .selectAll('path, circle')
            .each(function() {
              let titleElement = d3.select(this).select("title"); // this is the tag #

              if (!titleElement.empty()) {
                  if (titleElement.text() !== mousedDot) {
                      d3.select(this).attr("stroke-width", 1).attr("opacity", 0.2);
                  } else {
                      d3.select(this).attr("stroke-width", 8).raise();
                  }
              } else {
                  d3.select(this).attr("stroke-width", 1);
              }
          });
      })
      .on("mouseout", function () {
          d3.select(plot).selectAll('path, circle').attr("stroke-width", 1).attr("opacity", 1);
      });

    return plot;
  }