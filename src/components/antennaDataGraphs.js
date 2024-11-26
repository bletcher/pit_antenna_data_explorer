import * as Plot from "npm:@observablehq/plot";

//import {speciesMap, riversMap, variablesMapAnt} from "./maps.js";

export function antennaDataGraph(dataIn, envDataIn, selectedWidthIn, selectedFillVarIn, selectedFacetIn, selectedFlowXIn, {width}) {

  const colorScale = Plot.scale({
    color: {
      type: "categorical",
      domain: selectedFillVarIn === 'hour' 
        ? [...new Set(dataIn.map(d => d[selectedFillVarIn]))].sort((a, b) => Number(a) - Number(b))
        : [...new Set(dataIn.map(d => d[selectedFillVarIn]))].sort(),
      unknown: "var(--theme-foreground-muted)"
    }
  });

  return Plot.plot({
    //title: "Counts by river, survey type and species",
    width: selectedWidthIn,//1400, Plot does not render if width is too narrow
    marginRight: 55,
    //marginBottom: 0,
    height: selectedWidthIn * 0.5,
    //y: {grid: true, label: "Counts"},
    x: {label: "Day of year"},
    color: {...colorScale, legend: true},
    y: {
      //axis: true,
      //percent: false,
      //nice: true
    },
    marks: [
      Plot.rectY(dataIn, 
        Plot.binX(
          {
            y: "count",
            //type: "log"
          }, 
          {
            x: "j", 
            interval: 1,//intervalIn, 
            fill: selectedFillVarIn,
            fy: "year",
            fx: selectedFacetIn ? "riverOrdered" : null,
            tip: true,
          }         
        )
      ),
      Plot.line(envDataIn, 
        {
          x: "yday", 
          y: d => d.flowByRiver * selectedFlowXIn,
          stroke: "riverOrdered",
          width: 2,
          fy: "year",
          fx: selectedFacetIn ? "riverOrdered" : null,
          tip: true
        }
      ),  
      Plot.ruleY([0]),
      Plot.ruleX([0]),
      Plot.axisX({fontSize: "12px", nice: true}),
      Plot.axisY({fontSize: "12px"}),
      Plot.frame({stroke: "lightgrey"})      
    ],
    //facet: {data: dataIn, x: selectedFacetIn ? "riverOrdered" : null, y: "year"},
    
    style: {
      overflow: "auto",    // Makes the plot scrollable
      maxWidth: "100vw",   // Limits width to viewport width
      display: "block",     // Ensures proper container behavior
      //card: true
    }
/*
    style: {
      width: "100%",
      height: "100%",
      aspectRatio: "auto"
    }*/
  });
}

export function antennaMapGraph(dataIn, intervalIn, selectedFillVarIn, {width}) {

  const colorScale = Plot.scale({
    color: {
      type: "categorical",
      domain: selectedFillVarIn === 'hour' 
        ? [...new Set(dataIn.map(d => d[selectedFillVarIn]))].sort((a, b) => Number(a) - Number(b))
        : [...new Set(dataIn.map(d => d[selectedFillVarIn]))].sort(),
      unknown: "var(--theme-foreground-muted)"
    }
  });

  return Plot.plot({
    //title: "Counts by river, survey type and species",
    width: 1400,
    marginRight: 55,
    //marginBottom: 0,
    height: width * 0.4,
    //y: {grid: true, label: "Counts"},
    x: {label: "Day of year", zoom: true, grid: true},
    color: {...colorScale, legend: true},
    marks: [
      Plot.rectY(dataIn, 
        //{fx: selectedFacetVarIn},
        Plot.binX(
          {y: "count"}, 
          {
            x: "j", 
            interval: intervalIn, 
            fill: selectedFillVarIn,
            //fx: selectedFxVarIn, THis gives an empty plot
            fy: "year",
            tip: true,
          }         
        )
      ),
      Plot.ruleY([0]),
      Plot.ruleX([0]),
      Plot.axisX({fontSize: "12px", nice: true}),
      Plot.axisY({fontSize: "12px"}),
      //Plot.frame({stroke: "lightgrey"})      
    ],
    style: {
      width: "100%",
      height: "100%",
      aspectRatio: "auto"
    }
  });
}
