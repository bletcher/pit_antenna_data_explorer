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
import {antennaData} from "./components/antennaDataGraphs.js";
//import {interval} from 'https://observablehq.com/@mootari/range-slider';
```

```js
const cdwb = [...cdwbIn];

const formatTime = d3.timeFormat("%j");
//formatTime(new Date()); // "May 31, 2023"

cdwb.forEach(d => {
  const detectionDate = new Date(d.detectionDate); 
  const dateEmigrated = new Date(d.dateEmigrated); 
  d.detectionDate = detectionDate;
  d.dateEmigrated = dateEmigrated;
  d.j = Number(formatTime(d.detectionDate));
  //d.title = d.tag
});
```

```js
[...new Set(cdwb.map(d => d.survey))]

```

```js
const cdwbAntenna = cdwb.filter(d => d.survey === "stationaryAntenna");
```


```js
cdwbAntenna
```

```js
const years = [...new Set(cdwbAntenna.map(d => d.year))].sort().filter(d => isFinite(d));
const selectYears = (Inputs.select(years, {value: 2005, multiple: 4, width: 50}));
const selectedYears = Generators.input(selectYears);

const interval = d3.range(1, 31, 1);
const selectInterval = (Inputs.select(interval, {value: 1, multiple: false, width: 10}));
const selectedInterval = Generators.input(selectInterval);

const riverMeters = [...new Set(cdwbAntenna.map(d => d.riverMeter))].sort().filter(d => isFinite(d));
const selectRiverMeters = (Inputs.select(riverMeters, {value: riverMeters, multiple: true, width: 10}));
const selectedRiverMeters = Generators.input(selectRiverMeters);
```

<div class="wrapper2">
  <div class="card antSelectors">
    <h1 style="margin-bottom: 20px"><strong>Filter data</strong></h1>
    <div style="margin-top: 20px">
      <h2>Select year(s):</h2>
      ${view(selectYears)}
    </div>
    <div style="margin-top: 20px">
      <h2>Select interval (d):</h2>
      ${view(selectInterval)}
    </div>
    <div style="margin-top: 20px">
      <h2>Select antenna (river meter):</h2>
      ${view(selectRiverMeters)}
    </div>
  </div>
  <div class="card antGraph">
    ${antennaData(
      cdwbAntenna.filter(d =>
        selectedYears.includes(d.year) &&
        selectedRiverMeters.includes(d.riverMeter)
      ),
      selectedInterval,
      width)}
  </div>
</div>


```js
riverMeters
```