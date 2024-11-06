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
import {barChartOverview} from "./components/overviewGraphs.js";
//import {interval} from 'https://observablehq.com/@mootari/range-slider';
```

```js
const radioFacetByRiver = (Inputs.radio([true, false], {value: false, label: "Facet by river?"}));
const radioFacetedByRiver = Generators.input(radioFacetByRiver);
```
<!-- Cards with big numbers -->

<div class="wrapper1">
  <div class="card countsGraph">
    <div style="margin-bottom: 20px;">${radioFacetByRiver}</div>
    ${resize((width) => barChartOverview(cdwb, radioFacetedByRiver, {width}))}
  </div>
  <div class="summaryVertical">
    <b style="font-size: 28px;">Counts</b>
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
    <hr>
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
</div>

<div class = "small note">
  Survey type "portableAntenna" is missing `riverMeter`, so those data don't get y-axis value on the plot currently. Need to add `riverMeter` at the WBBook stage.
</div>

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
