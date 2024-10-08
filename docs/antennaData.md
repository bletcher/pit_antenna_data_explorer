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
import {speciesMap, riversMap, variablesMapAnt, variablesMapAntNoNull} from "./components/maps.js";
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

const cdwbAntenna = cdwb.filter(d => d.survey === "stationaryAntenna");
```


```js
//cdwbAntenna
```

```js
const years = [...new Set(cdwbAntenna.map(d => d.year))].sort().filter(d => isFinite(d));
const selectYears = (Inputs.select(years, {value: 2005, multiple: true, width: 50}));
const selectedYears = Generators.input(selectYears);
```

```js
const cdwbAntennaYears = cdwbAntenna.filter(
  d => selectedYears.includes(d.year)        
);
```

Number of observations:  
All: **${cdwbAntenna.length}**  
Filter by years: **${cdwbAntennaYears.length}**  
filter by rivers: **${cdwbAntennaYearsRiver.length}**  
Filter by antenna: **${cdwbAntennaYearsRiverRiverMeters.length}**  

```js
const rivers = [...new Set(cdwbAntennaYears.map(d => d.riverOrdered))].sort();
const selectRivers = (Inputs.select(riversMap, {value: rivers, multiple: true, width: 10}));
const selectedRivers = Generators.input(selectRivers);
```

```js
const cdwbAntennaYearsRiver = cdwbAntennaYears.filter(
  d => selectedRivers.includes(d.riverOrdered)        
)
```


```js
const riverMeters = [...new Set(cdwbAntennaYearsRiver.map(d => d.riverMeter))].sort();
const selectRiverMeters = (Inputs.select(riverMeters, {value: riverMeters, multiple: true, width: 10}));
const selectedRiverMeters = Generators.input(selectRiverMeters);
```

```js
const cdwbAntennaYearsRiverRiverMeters = cdwbAntennaYearsRiver.filter(
  d => selectedRiverMeters.includes(d.riverMeter)        
)
```

```js
const interval = d3.range(1, 31, 1);
const selectInterval = (Inputs.select(interval, {value: 1, multiple: false, width: 10}));
const selectedInterval = Generators.input(selectInterval);

//const fxVar = ["species", "riverOrdered", "riverMeter"];
const selectFxVar = (Inputs.select(variablesMapAnt, {value: "species", multiple: false, width: 10}));
const selectedFxVar = Generators.input(selectFxVar);

//const fyVar = ["species", "riverOrdered", "riverMeter"];
const selectFyVar = (Inputs.select(variablesMapAnt, {value: "year", multiple: false, width: 10}));
const selectedFyVar = Generators.input(selectFyVar);

//const fillVar = ["species", "riverOrdered", "riverMeter"];
const selectFillVar = (Inputs.select(variablesMapAntNoNull, {value: "species", multiple: false, width: 10}));
const selectedFillVar = Generators.input(selectFillVar);
```

<div class="wrapper2">
  <div class="card antSelectors">
    <h1 style="margin-bottom: 20px"><strong>Filter data</strong></h1>
    <div style="margin-top: 20px">
      <h2>Select year(s):</h2>
      ${view(selectYears)}
    </div>
    <div style="margin-top: 20px">
      <h2>Select river(s):</h2>
      ${view(selectRivers)}
    </div>
    <div style="margin-top: 20px">
      <h2>Select antenna (river meter):</h2>
      ${view(selectRiverMeters)}
    </div>
    <hr>
    <div style="margin-top: 20px">
      <h2>Select plotting interval (days):</h2>
      ${view(selectInterval)}
    </div>
    <div style="margin-top: 20px">
    <h2>Select plotting variable:</h2>
      ${view(selectFillVar)}
    </div>
  </div>
  <div class="card antGraph">
    ${antennaData(
      cdwbAntennaYearsRiverRiverMeters,
      selectedInterval,
      selectedFillVar,
      width
    )}
  </div>
</div>

cdwbAntennaYearsRiverRiverMeters
```js
cdwbAntennaYearsRiverRiverMeters
```
