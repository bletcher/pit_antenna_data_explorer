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
  const lagDetectionDate = new Date(d.lagDetectionDate); 
  d.detectionDate = detectionDate;
  d.lagDetectionDate = lagDetectionDate;
  d.title = d.tag
});
```

```js
import {plotSizeTrajectories} from "./components/sizeTrajectoriesGraphs.js";
//import {interval} from 'https://observablehq.com/@mootari/range-slider';
```

```js
const cohorts = [...new Set(cdwb.map(d => d.cohort))].sort().filter(d => isFinite(d));
const selectCohortsOV = (Inputs.select(cohorts, {value: 2005, multiple: 8, width: 90}));
const selectedCohorts = Generators.input(selectCohortsOV);

const species = [...new Set(cdwb.map(d => d.species))].sort();
const selectSpeciesOV = (Inputs.select(speciesMap, {value: species, multiple: true, width: 80}));
const selectedSpecies = Generators.input(selectSpeciesOV);

const rivers = [...new Set(cdwb.map(d => d.riverOrdered))].sort();
const selectRiversOV = (Inputs.select(riversMap, {value: rivers, multiple: true, width: 120}));
const selectedRivers = Generators.input(selectRiversOV);

//const surveys = [...new Set(cdwb.map(d => d.survey))];
//const selectSurveysOV = (Inputs.select(surveysMap, {value: surveys, multiple: true, width: 160}));
//const selectedSurveys = Generators.input(selectSurveysOV);

const radioIncludeUntagged = (Inputs.radio([true, false], {value: true, label: "Include untagged fish?"}));
const selectedIncludeUntagged = Generators.input(radioIncludeUntagged);

const rangeHeight = (Inputs.range([200, 2000], {step: 10, value: 950, label: 'Chart height'}));
const selectedRangeHeight = Generators.input(rangeHeight);

const selectToolTip = (Inputs.radio([true, false], {value: false, label: "Show tool tip?"}));
const selectedToolTip = Generators.input(selectToolTip);
```

```js
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
    <hr>
    ${rangeMinLength}
    ${rangeMaxLength}
    ${rangeMinN}
    ${rangeMaxN}
    <hr>
    ${radioIncludeUntagged}
  </div>
  <div class="card rasterGraph">
    <div style="display: flex; flex-direction: row; align-items: flex-end; justify-content: flex-end;">
      ${rangeHeight}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${selectToolTip}
    </div>
    <div>
      ${plotSizeTrajectories(
        cdwbFiltered,
        selectedRangeHeight,
        selectedToolTip,
        {width}
      )}
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
```

---

```js
//These need to be here to avoid circular dependencies
const extentLength = (d3.extent(cdwbFiltered0.map(d => d.observedLength)))
const rangeMinLength = (Inputs.range([extentLength[0], extentLength[1]], {step: 10, value: extentLength[0], label: 'Minimum fish length:'}));
const selectedRangeMinLength = Generators.input(rangeMinLength);
const rangeMaxLength = (Inputs.range([rangeMinLength, extentLength[1]], {step: 10, value: extentLength[1], label: 'Maximum fish length:'}));
const selectedRangeMaxLength = Generators.input(rangeMaxLength);

const rangeMinN = (Inputs.range([1, d3.max(cdwbFiltered0, d => d.nPerInd)], {step: 1, value: 1, label: 'Minimum num obs/fish:'}));
const selectedRangeMinN = Generators.input(rangeMinN);
const rangeMaxN = (Inputs.range([rangeMinN, d3.max(cdwbFiltered0, d => d.nPerInd)], {step: 1, value: d3.max(cdwbFiltered0, d => d.nPerInd), label: 'Maximum num obs/fish:'}));
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
