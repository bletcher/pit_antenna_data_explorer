---
theme: dashboard
toc: false
style: gridCustom.css
---


```js
import { plotRangeOverTime } from "./components/rangeOverTimeGraphs.js";
import { getDatByIndividual } from "./components/rangeOverTimeFunctions.js";

//import {interval} from 'https://observablehq.com/@mootari/range-slider';
```

```js
//const cdwb = FileAttachment("data/all_for_obs.csv").csv({typed: true});
const cdwbIn = FileAttachment("data/cdwb.json").json(); // this is a lot faster than the parquet file
//const cdwbIn = FileAttachment("data/parquet/part-0.parquet").parquet();
```

```js
const cdwbCJSModelsIn = FileAttachment("data/cdwbCJSModels.json").json(); 
```

```js
const cdwbCJSModels = [...cdwbCJSModelsIn];

cdwbCJSModels.forEach(d => {
  const medianDate = new Date(d.medianDate); 
});
```


```js
cdwbCJSModels
```

```js
const cdwb = [...cdwbIn];

cdwb.forEach(d => {
  const detectionDate = new Date(d.detectionDate); 
  const dateEmigrated = new Date(d.dateEmigrated); 
  d.detectionDate = detectionDate;
  d.dateEmigrated = dateEmigrated;
  d.title = d.tag // This is for interactivity in the graph
});
```

```js
cdwb
```

```js
const cdwbByIndFiltered = getDatByIndividual(cdwbFiltered)
  .sort((a, b) => {
    // Convert to Date objects if minDate is a string
    const dateA = new Date(a["minDate"]);
    const dateB = new Date(b["minDate"]);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    } else {
      return b["count"] - a["count"];
    }
  }) 
  .map((d, i) => ({
    ...d,
    xPosition: i // Add dummy variable for x-axis positioning
  }));
```

```js
cdwbByIndFiltered
```

```js
const cohorts = [...new Set(cdwb.map(d => d.cohort))].sort().filter(d => isFinite(d) && d >= 1995);
const selectCohortsOV = (Inputs.select(cohorts, {value: [2003], multiple: 4, width: 20}));
const selectedCohorts = Generators.input(selectCohortsOV);

const species = [...new Set(cdwb.map(d => d.species))].sort();
const selectSpeciesOV = (Inputs.select(speciesMap, {value: species, multiple: true, width: 70}));
const selectedSpecies = Generators.input(selectSpeciesOV);

const rivers = [...new Set(cdwb.map(d => d.riverOrdered))].sort();
const selectRiversOV = (Inputs.select(riversMap, {value: rivers, multiple: true, width: 70}));
const selectedRivers = Generators.input(selectRiversOV);

const surveys = [...new Set(cdwb.map(d => d.survey))];
const selectSurveysOV = (Inputs.select(surveysMap, {value: surveys, multiple: true, width: 70}));
const selectedSurveys = Generators.input(selectSurveysOV);

const rangeHeight = (Inputs.range([200, 2000], {step: 10, value: 950, label: 'Chart height', width: 160}));
const selectedRangeHeight = Generators.input(rangeHeight);

const selectToolTip = (Inputs.radio([true, false], {value: false, label: "Show tool tip?"}));
const selectedToolTip = Generators.input(selectToolTip);
```


```js
const plotFacetVars = ["cohort", "species", "survey", ""]
const selectPlotFacetVars = (Inputs.select(plotFacetVars, {value: "cohort", multiple: false, width: 80}));
const selectedPlotFacetVars = Generators.input(selectPlotFacetVars);

const colorVariables = ["cohort", "species", "survey", ""];
const selectColorVariable = (Inputs.select(colorVariables, {value: "species", multiple: false, width: 80}));
const selectedColorVariable = Generators.input(selectColorVariable);

const minYValue = (Inputs.range([0, cdwbByIndFiltered.length], {step: 10, value: 0, label: 'Minimum y value', width: 160}));
const selectedMinYValue = Generators.input(minYValue);

const maxYValue = (Inputs.range([0, cdwbByIndFiltered.length], {step: 10, value: cdwbByIndFiltered.length, label: 'Maximum y value', width: 160}));
const selectedMaxYValue = Generators.input(maxYValue);

//const cjsValue = (Inputs.checkbox(["Survival", "Capture", "none"], {label: "Show CJS data"}));
const cjsValues = [...new Set(cdwbCJSModels.map(d => d.variable))];
const cjsValue = (Inputs.select(cjsMap, {value: ["phiBetaIntercept"], label: "Show CJS data", multiple: true}));
const selectedCJSValue = Generators.input(cjsValue);

const radioPlotMax = (Inputs.radio([true, false], {value: false, label: "Highlight last date?"}));
const selectedRadioPlotMax = Generators.input(radioPlotMax);

const radioPlotDates = (Inputs.radio([true, false], {value: false, label: "Plot all dates?"}));
const selectedRadioPlotDates = Generators.input(radioPlotDates);
```

```js

const variablesMap = new Map([
  ["Fish length", "observedLength"],
  ["Fish Mass", "observedWeight"],
  ["River meter", "riverMeter"],
  ["Section Number", "sectionN"]
]);

const speciesMap = new Map([
  ["Brook trout", "bkt"],
  ["Brown trout", "bnt"],
  ["Atlantic salmon", "ats"]
]);

const riversMap = new Map([
  ["West brook", "West Brook"],
  ["Open large", "WB Jimmy"],
  ["Open small", "WB Mitchell"],
  ["Isolated small", "WB OBear"]
]);

const surveysMap = new Map([
  ["Electrofishing", "shock"],
  ["Pit tag antenna", "stationaryAntenna"],
  ["Pit tag wand", "portableAntenna"]
]);

const cjsMap = new Map([
  ["Survival", "phiBetaIntercept"],
  ["Capture", "pBetaIntercept"]
]);
```

<div class="wrapper2">
  <div class="card selectors">
    <h1 style="margin-bottom: 20px"><strong>Filter data</strong></h1>
    Select one or more cohorts. All other variables are selected by default.
    <div style="margin-top: 20px">
      <h2>1) Select cohorts:</h2>
      ${view(selectCohortsOV)}
    </div>
    <div style="margin-top: 20px">
      <h2>Select species:</h2>
      ${selectSpeciesOV}
    </div>
    <div style="margin-top: 20px">
      <h2>Select rivers:</h2>
      ${selectRiversOV}
    </div>
    <div style="margin-top: 20px">
      <h2>Select survey type:</h2>
      ${selectSurveysOV}
    </div>
    <hr style="margin-top: 0px; margin-bottom: 0px; border-width: 3px">
    <div style="margin-top: 0px">
      <h2>Panel variable:</h2>
      <div style="display: flex; align-items: center; gap: 15px">
        ${view(selectPlotFacetVars)}  
      </div>
    </div>
    <div style="margin-top: 20px">
      <h2>Color variable:</h2>
      <div style="display: flex; align-items: center; gap: 15px"> 
        ${view(selectColorVariable)}
      </div>
    </div>
    <hr style="margin-top: 5px; margin-bottom: 0px">
    <div style="margin-top: 2px">
      <h2>Filter the y-axis:</h2>
      ${view(minYValue)} ${view(maxYValue)}
    </div>
    <hr style="margin-top: 5px; margin-bottom: 0px">
    <div style="margin-top: 2px">
      ${view(radioPlotMax)}
    </div>
    <div style="margin-top: 2px">
      ${view(radioPlotDates)} 
    </div>
    <div style="margin-top: 15px">
       ${view(cjsValue)}
    </div>
    <hr>
    ${rangeMinLength}
    ${rangeMaxLength}
    ${rangeMinN}
    ${rangeMaxN}
    <hr>
    ${rangeHeight}
    ${selectToolTip}
  </div>
  <div class="card rasterGraph">
    <div>
      ${plotRangeOverTime(
        cdwbByIndFiltered,
        cdwbCJSModelsFiltered,
        selectedPlotFacetVars,
        selectedColorVariable,
        colorVariables,
        selectedMinYValue,
        selectedMaxYValue,
        selectedRadioPlotMax,
        selectedRadioPlotDates,
        selectedCJSValue,
        {width}
      )}
    </div>
    <div style="margin-top: 20px">
      The horizontal lines are individual fish observations from the first to last capture date. Lines are ordered vertically by minimum date of capture and then by number of observations within each minimum date. <br><br>  
      The dots are either estimated proportion of individuals remaining for the cohort from a CJS model or probability of capture for the either salmon or trout cohorts (trout species and river locations combined).
    </div>
  </div>
</div>


```js
const cdwbFiltered0 = cdwb.filter(
  d => d.title !== "untagged" 
)
```

```js
const cdwbFiltered = cdwbFiltered0.filter(
  d => {
    if(d.survey === "shock") {
      return d.riverMeter > 4000 && 
        selectedSpecies.includes(d.species) &&
        selectedCohorts.includes(d.cohort) &&
        selectedRivers.includes(d.riverOrdered) &&
        selectedSurveys.includes(d.survey) &&
        d.observedLength >= selectedRangeMinLength &&
        d.observedLength <= selectedRangeMaxLength &&
        d.nPerInd >= selectedRangeMinN &&
        d.nPerInd <= selectedRangeMaxN;
    } else if(d.survey === "stationaryAntenna") {
      return d.riverMeter > 0 && 
        selectedSpecies.includes(d.species) &&
        selectedCohorts.includes(d.cohort) &&
        selectedRivers.includes(d.riverOrdered) &&
        selectedSurveys.includes(d.survey);
    } else if(d.survey === "portableAntenna") {
       return selectedSpecies.includes(d.species) && // need to add riverMeter to survey==portableAntenna
        selectedCohorts.includes(d.cohort) &&
        selectedRivers.includes(d.riverOrdered) &&
        selectedSurveys.includes(d.survey);
    }
  }
);
```

```js
const cdwbCJSModelsFiltered = cdwbCJSModels.filter(
  d => {
      return selectedCohorts.includes(d.cohort)
  }
);
```

```js
cdwbByIndFiltered.filter(d => d.title === "4109701335")
```


---

```js
//These need to be here to avoid circular dependencies
const extentLength = (d3.extent(cdwbFiltered0.map(d => d.observedLength)))
const rangeMinLength = (Inputs.range([extentLength[0], extentLength[1]], {step: 10, value: extentLength[0], label: 'Minimum fish length:', width: 150}));
const selectedRangeMinLength = Generators.input(rangeMinLength);
const rangeMaxLength = (Inputs.range([rangeMinLength, extentLength[1]], {step: 10, value: extentLength[1], label: 'Maximum fish length:', width: 150}));
const selectedRangeMaxLength = Generators.input(rangeMaxLength);

const rangeMinN = (Inputs.range([1, d3.max(cdwbFiltered0, d => d.nPerInd)], {step: 1, value: 1, label: 'Minimum num obs/fish:', width: 150}));
const selectedRangeMinN = Generators.input(rangeMinN);
const rangeMaxN = (Inputs.range([rangeMinN, d3.max(cdwbFiltered0, d => d.nPerInd)], {step: 1, value: d3.max(cdwbFiltered0, d => d.nPerInd), label: 'Maximum num obs/fish:', width: 150}));
const selectedRangeMaxN = Generators.input(rangeMaxN);
```

Number of rows in filtered dataset: ${cdwbFiltered.length}  

```js
const uniqueTags = new Set(cdwbFiltered.map(d => d.tag));
```

Number of **individuals** in filtered dataset: ${uniqueTags.size}

```js
display(cdwbFiltered)
```

---
