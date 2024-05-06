---
theme: dashboard
title: Filter data
toc: false
---

# Trout and salmon number of observations

```js
const cdwb = FileAttachment("data/all_for_obs.csv").csv({typed: true});
//const cdwb = FileAttachment("data/all_for_obs.json").json();
```

```js
import {barChartOverview, plotSelectedByInd} from "./components/overview.js";
//import {interval} from 'https://observablehq.com/@mootari/range-slider';
```

```js
cdwb.map(d => d.newDate = new Date(d.detectionDate));
```

<!-- Cards with big numbers -->

<div class="grid grid-cols-3">
  <div class="card">
    <h2>Brook trout</h2>
    <span class="big">${cdwb.filter((d) => d.species === "bkt").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>Brown trout</h2>
    <span class="big">${cdwb.filter((d) => d.species === "bnt").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>Atlantic salmon</h2>
    <span class="big">${cdwb.filter((d) => d.species === "ats").length.toLocaleString("en-US")}</span>
  </div>
</div>

<hr></hr>

<div class="grid grid-cols-3">
  <div class="card">
    <h2>Shocking</h2>
    <span class="big">${cdwb.filter((d) => d.survey === "shock").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>Stationary antenna</h2>
    <span class="big">${cdwb.filter((d) => d.survey === "stationaryAntenna").length.toLocaleString("en-US")}</span>
  </div>
    <div class="card">
    <h2>Portable antenna</h2>
    <span class="big">${cdwb.filter((d) => d.survey === "portableAntenna").length.toLocaleString("en-US")}</span>
  </div>
</div>

<hr>

```js
// Table of whole dataset.
//const tableCDWB = view(Inputs.table(cdwb, {required: false}));
```

<div class="card">
  ${resize((width) => barChartOverview(cdwb, {width}))}
</div>

<hr>

<div class = "small note">
  Survey type "portableAntenna" is missing `riverMeter`, so those data don't get y-axis value on the plot currently. Need to add `rvierMeter` at the WBBook stage.
</div>

```js
const radioIncludeUntagged = view(Inputs.radio([true, false], {value: true, label: "Include untagged fish?"}));
```

<hr>

```js
const cohorts = [...new Set(cdwb.map(d => d.cohort))].sort().filter(d => isFinite(d));
const selectCohortsOV = (Inputs.select(cohorts, {value: 2005, multiple: 8, width: 90, label: "Select cohorts"}));
const selectedCohorts = Generators.input(selectCohortsOV);

const species = [...new Set(cdwb.map(d => d.species))].sort();
const selectSpeciesOV = (Inputs.select(species, {value: species, multiple: true, width: 80, label: "Select species"}));
const selectedSpecies = Generators.input(selectSpeciesOV);

const rivers = [...new Set(cdwb.map(d => d.riverOrdered))].sort();
const selectRiversOV = (Inputs.select(rivers, {value: rivers, multiple: true, width: 120, label: "Select rivers"}));
const selectedRivers = Generators.input(selectRiversOV);

const surveys = [...new Set(cdwb.map(d => d.survey))];
const selectSurveysOV = (Inputs.select(surveys, {value: surveys, multiple: true, width: 160, label: "Select surveys"}));
const selectedSurveys = Generators.input(selectSurveysOV);
```

## Filter the dataset
Select a cohort. Other variables are all selected by default.

<div class="grid grid-cols-4"> 
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${view(selectCohortsOV)}
  </div>
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${selectSpeciesOV}
  </div>
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${selectRiversOV}
  </div>
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${selectSurveysOV}
  </div>
</div>

```js
const cdwbFiltered0 = cdwb.filter(
  d => {
    if(radioIncludeUntagged) {
      return true;
    } else {
      return d.tag !== "untagged"
    } 
})
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
)
```

<hr></hr>

```js
const extentLength = (d3.extent(cdwbFiltered0.map(d => d.observedLength)))
const rangeMinLength = (Inputs.range([extentLength[0], extentLength[1]], {step: 10, value: extentLength[0], label: 'Minimum fish length'}));
const selectedRangeMinLength = Generators.input(rangeMinLength);
const rangeMaxLength = (Inputs.range([rangeMinLength, extentLength[1]], {step: 10, value: extentLength[1], label: 'Maximum fish length'}));
const selectedRangeMaxLength = Generators.input(rangeMaxLength);

const rangeMinN = (Inputs.range([1, d3.max(cdwbFiltered0, d => d.nPerInd)], {step: 1, value: 1, label: 'Maximum num obs/fish'}));
const selectedRangeMinN = Generators.input(rangeMinN);
const rangeMaxN = (Inputs.range([rangeMinN, d3.max(cdwbFiltered0, d => d.nPerInd)], {step: 1, value: d3.max(cdwbFiltered0, d => d.nPerInd), label: 'Maximum num obs/fish'}));
const selectedRangeMaxN = Generators.input(rangeMaxN);
```

<div class="grid grid-cols-3">
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${rangeMinLength}
  </div>
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${rangeMaxLength}
  </div>
</div>

<div class="grid grid-cols-3">
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${rangeMinN}
  </div>
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    ${rangeMaxN}
  </div>
</div>

Number of rows in filtered dataset: ${cdwbFiltered.length}

```js
display(cdwbFiltered)
```

<hr></hr>

```js
const rangeHeight = (Inputs.range([200, 2000], {step: 10, value: 600, label: 'Chart height'}));
const selectedRangeHeight = Generators.input(rangeHeight);
```
In the chart below, sybmol colors are individuals (blue is untagged), size of the symbol is proportional to fish length and the symbol represents survey type. The chart is facetted by river and cohort.
<div class="card">
  <div style="display: flex; flex-direction: column; align-items: flex-end;">${rangeHeight}</div>
  <div> </div>
  ${resize((width) => plotSelectedByInd(
      cdwbFiltered,
      surveys,
      selectedRangeHeight,
      {width}
    )
    )
  }
</div>

<div class = "small note">
  small note
</div>


ToDo: fix the scale for r, so r doesn't change as observedLength is filtered
