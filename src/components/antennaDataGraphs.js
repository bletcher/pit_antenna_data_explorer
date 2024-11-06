import * as Plot from "npm:@observablehq/plot";

//import {speciesMap, riversMap, variablesMapAnt} from "./maps.js";

export function antennaData(dataIn, intervalIn, selectedFillVarIn, {width}) {

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
    height: 800,
    //y: {grid: true, label: "Counts"},
    x: {label: "Day of year"},
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
    ]
  });
}
