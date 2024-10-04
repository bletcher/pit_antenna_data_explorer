import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
//import {select} from "d3-selection";
import {groupSort} from "npm:d3";
import { timeFormat } from 'd3-time-format';

export function barChartOverview(data, radioFacetedByRiver, {width}) {
  const color = Plot.scale({
    color: {
      type: "categorical",
      domain: groupSort(data, (D) => -D.length, (d) => d.survey).filter((d) => d !== "Other"),
      unknown: "var(--theme-foreground-muted)"
    }
  });

  return Plot.plot({
    //title: "Counts by river, survey type and species",
    width,
    height: 550,
    marginTop: 40,
    marginLeft: 50,
    marginRight: 120,
    y: {grid: true, label: "Counts"},
    x: {
      label: "Year", 
      labelFontSize: "26px", 
      //nice: true, 
      ticks: [1997, 2000, 2003, 2006, 2009, 2012, 2015, 2018, 2021], 
      fontSize: "14px"
    },
    color: {...color, legend: true},
    marks: [
      Plot.rectY(data, 
        Plot.groupX(
          {y: "count"}, 
          {x: "year", 
            fill: "survey", 
            tip: true, 
            fy: radioFacetedByRiver ? "riverOrdered" : null, 
            fx: "species"
          }
        )
      ),
      Plot.ruleY([0]),
      //Plot.axisX({fontSize: "12px", nice: true}),
      Plot.axisY({fontSize: "12px"}),
      Plot.frame({stroke: "lightgrey"})
      //Plot.timeInterval("2 years")
      
    ]
  });
}
