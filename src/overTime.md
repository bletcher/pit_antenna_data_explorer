---
theme: dashboard
toc: false
style: gridCustom.css
---

```js
//const cdwb = FileAttachment("data/all_for_obs.csv").csv({typed: true});
const cdwbIn = FileAttachment("data/cdwb.json").json(); // this is a lot faster than the parquet file
//const cdwbIn = FileAttachment("data/parquet/part-0.parquet").parquet();
```


```js
const cdwb = [...cdwbIn];

cdwb.forEach(d => {
  const detectionDate = new Date(d.detectionDate); 
  const dateEmigrated = new Date(d.dateEmigrated); 
  d.detectionDate = detectionDate;
  d.dateEmigrated = dateEmigrated;
  d.title = d.tag
});
```

```js
import {plotOverTime} from "./components/overTimeGraphs.js";
//import {interval} from 'https://observablehq.com/@mootari/range-slider';
```

```js
const variables = ["observedLength", "observedWeight", "sectionN", "riverMeter"];
const selectVariable = (Inputs.select(variablesMap, {value: "observedLength", multiple: false, width: 80}));
const selectedVariable = Generators.input(selectVariable);

const cohorts = [...new Set(cdwb.map(d => d.cohort))].sort().filter(d => isFinite(d));
const selectCohortsOV = (Inputs.select(cohorts, {value: [2005], multiple: 4, width: 20}));
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

const radioIncludeUntagged = (Inputs.radio([true, false], {value: true, label: "Include untagged fish?"}));
const selectedIncludeUntagged = Generators.input(radioIncludeUntagged);

const rangeHeight = (Inputs.range([200, 2000], {step: 10, value: 950, label: 'Chart height', width: 160}));
const selectedRangeHeight = Generators.input(rangeHeight);

const selectToolTip = (Inputs.radio([true, false], {value: false, label: "Show tool tip?"}));
const selectedToolTip = Generators.input(selectToolTip);
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
```

<div class="wrapper2">
  <div class="card selectors">
    <h1 style="margin-bottom: 20px"><strong>Select variable</strong></h1>
      <div style="margin-top: 10px; margin-bottom: 0px">
        ${view(selectVariable)}
      </div>
      <hr>
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
    <hr>
    ${rangeMinLength}
    ${rangeMaxLength}
    ${rangeMinN}
    ${rangeMaxN}
    <hr>
    ${radioIncludeUntagged}
    <hr>
    ${rangeHeight}
    ${selectToolTip}
  </div>
  <div class="card rasterGraph">
    <div>
      ${plotOverTime(
        cdwbFiltered,
        selectedVariable,
        selectedSurveys,
        selectedRangeHeight,
        selectedToolTip,
        riversMap,
        {width}
      )}
      <hr>
      Double-click on a point to copy to PIT tag # to the clipboard.
    </div>
  </div>
</div>

```js
const cdwbFiltered0 = cdwb.filter(
  d => {
    if(selectedIncludeUntagged) {
      return true;
    } else {
      return d.tag !== "untagged"
    } 
})
```

```js
/*
const cdwbFiltered = cdwbFiltered0.filter(d => {
  return (
    d.riverMeter > 4000 &&
    selectedSpecies.includes(d.species) &&
    selectedCohorts.includes(d.cohort) &&
    selectedRivers.includes(d.riverOrdered) &&
    d.observedLength >= selectedRangeMinLength &&
    d.observedLength <= selectedRangeMaxLength &&
    d.nPerInd >= selectedRangeMinN &&
    d.nPerInd <= selectedRangeMaxN
  );
});
*/
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
)
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
