---
theme: dashboard
toc: false
style: gridCustom.css
---

```js
import proj4 from 'proj4';
```

```js
import {antennaData} from "./components/antennaDataGraphs.js";
import {speciesMap, riversMap, variablesMapAnt, variablesMapAntNoNull} from "./components/maps.js";
//import {interval} from 'https://observablehq.com/@mootari/range-slider';
```

```js
//const cdwb = FileAttachment("data/all_for_obs.csv").csv({typed: true});
const cdwbIn = FileAttachment("data/cdwb.json").json(); // this is a lot faster than the parquet file

// file created from `C:\Users\bletcher\OneDrive - DOI\PITTAGMAIN\West Brook data\Antenna data\Copy of sites.xlsx`, saved as a csv and copied to the data folder
const sitesIn = FileAttachment("data/Copy of Sites_all_UTM.csv").csv({typed: true});

//Copied from C:\Users\bletcher\OneDrive - DOI\PITTAGMAIN\West Brook data\
const coordsIn = FileAttachment("data/WBCoordsForD3JS.csv").csv({typed: true});

//const cdwbIn = FileAttachment("data/parquet/part-0.parquet").parquet();
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
//years[7]
//cdwbAntenna
```

```js
const years = [...new Set(cdwbAntenna.map(d => d.year))].sort().filter(d => isFinite(d));
const selectYears = (Inputs.select(years, {value: years, multiple: true, width: 50}));
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
//const selectRivers = (Inputs.select(riversMap.filter(d = > rivers.includes(d.riverOrdered)), {value: rivers, multiple: true, width: 10}));
const filteredRiversMap = new Map(
  Array.from(riversMap).filter(([key, value]) => rivers.includes(value))
);
const selectRivers = (Inputs.select(filteredRiversMap, {value: rivers, multiple: true, width: 10}));
const selectedRivers = Generators.input(selectRivers);
```

riversMap
```js
filteredRiversMap
//riversMap.filter(d => rivers.includes(d))
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
    <h2>Select color variable:</h2>
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

---

```js
coordsIn.forEach(d => {
  d.siteID = `${d.riverAbbr}_${d.section}`;
  //d.title = d.tag
});
```

```js
coordsIn
```

```js
/////////
// Map //
/////////
import { baseMap, addMarkers, addClickListenersToMarkers, updateMarkerStyles } from "./components/antennaDataFunctions.js";
```

```js
/////////
// Map //
/////////

  const lat1 = 42.4344;
  const lon1 = -72.67;
  const mag1 = 16.4;

  const div_map1 = display(document.createElement("div"));
  div_map1.style = "height: 750px;";

  const map1 = L.map(div_map1)
    .setView([lat1, lon1], mag1);

  L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',   
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
  )
  .addTo(map1);

  L.control.layers(baseMap).addTo(map1);
  baseMap.USGS_hydro.addTo(map1);

  // Store the initial map view
  const initialView1 = map1.getBounds();

  // Update the map view when the window is resized
  window.addEventListener('resize', function() {
    map1.fitBounds(initialView1);
  });
```

```js
/////////////////////////////////
// Add map markers and updates //
/////////////////////////////////
const initialSite = "WB_1";

let markers = addMarkers(coordsIn, map1);
let markersSelected = Mutable([initialSite]);
addClickListenersToMarkers(markers, markersSelected);
updateMarkerStyles(markers);
```










```js
function convertUTMToLatLon(easting, northing, zone) {
    const utmProj = `+proj=utm +zone=${zone} +datum=WGS84 +units=m +no_defs`;
    const latLonProj = '+proj=longlat +datum=WGS84 +no_defs';
    return proj4(utmProj, latLonProj, [easting, northing]);
}


/*
 * Function to calculate UTM zone from longitude
 * @param {number} lon - Longitude
 * @returns {number} - UTM zone
 */
function getUTMZone(lon) {
    return Math.floor((lon + 180) / 6) + 1;
}
```

```js
/*
const utmZone = getUTMZone(-72.5);

sitesIn.forEach(d => {
        const latLon = convertUTMToLatLon(d.x, d.y, utmZone);
        d.latitude = latLon[1];
        d.longitude = latLon[0];
    });
    

//sitesIn
*/
```