import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
//import {select} from "d3-selection";
import {groupSort} from "npm:d3";
import { timeFormat } from 'd3-time-format';

export function antennaData(data, intervalIn, {width}) {


  return Plot.plot({
    //title: "Counts by river, survey type and species",
    width,
    //height: 800,
    //y: {grid: true, label: "Counts"},
    x: {label: "Day of year"},
    //color: {...color, legend: true},
    marks: [
      Plot.rectY(data, 
        //{fy: "year"},
        Plot.binX(
          {y: "count"}, 
          {x: "j", interval: intervalIn,
           fy: "year"
            //tip: true, 
            //fy: radioFacetedByRiver ? "riverOrdered" : null, 
          }
          
        )
      )//,
      //Plot.ruleY([0]),
      //Plot.axisX({fontSize: "12px", nice: true}),
      //Plot.axisY({fontSize: "12px"}),
      //Plot.frame({stroke: "lightgrey"})
      //Plot.timeInterval("2 years")
      
    ]
  });
}

/*
x: {
  label: "Year", 
  labelFontSize: "26px", 
  //nice: true, 
  ticks: [1997, 2000, 2003, 2006, 2009, 2012, 2015, 2018, 2021], 
  fontSize: "14px"
},
*/