import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
//import {select} from "d3-selection";
import { groupSort } from "npm:d3";
import { timeFormat } from 'd3-time-format';


//export function plotRangeOverTime(dataIn, variableIn, surveySet, rangeHeight, selectedToolTip, riversMap, {width}) {


// selectedVariable,
// selectedSurveys,
// selectedRangeHeight,
// selectedToolTip,
// riversMap,

export function plotRangeOverTime(
  dIn, 
  // orderVar = "minDate", 
  // strokeVar = "riverOrdered", 
  // //fillVarsValues, 
  facetVar = "cohort", 
  minXValue,
  maxXValue, 
  plotMax = false, 
  plotDates = false, 
 {width}
) {

  dIn = dIn.filter(d => d.xPosition >= minXValue && d.xPosition <= maxXValue);

  // Define fixed color scale
  // const colorScale = Plot.scale({
  //   color: {
  //     type: "categorical",
  //     domain: fillVarsValues, // Use actual values from fillVar
  //     //range: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", 
  //     //        "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"], // Fixed colors
  //     unknown: "var(--theme-foreground-muted)"
  //   }
  // });


  const plot = Plot.plot({
    width: width,
    height: 1000,
    //marginBottom: 100,
    y: {
      //label: `Individuals Order (by ${orderVar})`,
      //tickFormat: d => processedData[d]?.["Account #"] || ""
      //tickFormat: null
    },
    x: {
      type: "time",
      grid: true, 
      label: "Date"
    },
    color: {
  //    ...colorScale,
      legend: true,
      tickFormat: d => d
    },
    marks: [
      Plot.frame({stroke: "lightgrey"}),
      Plot.axisY({ticks: []}),
      Plot.link(
        dIn,
        {
          y: "xPosition",
          x1: "minDate",
          x2: "maxDate",
          //markerStart: "dot",
          markerEnd: "dot",
          strokeWidth: 0.33,
          //stroke: d => d[internalStrokeVar] ? d[internalStrokeVar] : "grey",
          //fy: "year",
          fx: facetVar,
          tip: true,
          title: d => `Tag: ${d["title"]}\nMin: ${d.minDate}\nMax: ${d.maxDate}\nCount: ${d.count}`
        }
      ),
      ...(plotMax ? [Plot.dot(
        dIn,
        {
          x: "maxDate",
          y: "xPosition",
          stroke: "grey",// d => d[internalStrokeVar] ? d[internalStrokeVar] : "grey",
          fill: "white",
         fx: facetVar,
          r: 2
        }
      )] : []),
      ...(plotDates ? [Plot.dot(
        dIn.flatMap(d => d.dates.map(date => ({
          ...d,
          date: date
        }))),
        {
          x: "date",
          y: "xPosition",
          stroke: "darkgrey",// d => d[internalStrokeVar] ? d[internalStrokeVar] : "grey",
          fill: "white",
          fx: facetVar,
          r: 2,
          //tip: true,
          //title: d => `Date: ${d.dates}`
        }
      )] : [])
    ]
  })

  return plot;
}

  export function plotRangeOverTime0(dataIn, variableIn, surveySet, rangeHeight, selectedToolTip, riversMap, {width}) {
    
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
      //title: "Filtered dataset",
      width,
      height: rangeHeight,
      x: {grid: true, nice: true, label: "Date"},
      color: {...colorScale, legend: false},
      symbol: {...symbolScale, legend: true},
      facet: {label: "River", fontSize: "14px"},
      marks: [
        Plot.frame({stroke: "lightgrey"}),
        Plot.dot(dataIn, {
          x: "detectionDate", y: variableIn, 
          stroke: "tag", symbol: "survey", 
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
          x: "detectionDate", y: variableIn, 
          stroke: "tag",
          fy: "cohort", fx: "riverOrdered",
          title: "tag"
        }),
        Plot.axisX({fontSize: "15px"}),
        Plot.axisY({fontSize: "14px"})
      ]
    });

    //https://observablehq.com/@mcmcclur/a-plot-selection-hack
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
      })
      .on("dblclick", function() {
        // Get the text from the title element
        const textToCopy = d3.select(this).select("title").text();
    
        // Create a temporary textarea element to hold the text
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = textToCopy;
        document.body.appendChild(tempTextArea);
    
        // Select the text in the textarea and copy it to the clipboard
        tempTextArea.select();
        document.execCommand("copy");
    
        // Remove the temporary textarea element
        document.body.removeChild(tempTextArea);
    
        // Optionally, you can provide feedback to the user
        console.log("Text copied to clipboard:", textToCopy);
    })
      ;

    return plot;
  }
