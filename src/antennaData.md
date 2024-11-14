---
theme: dashboard
toc: false
style: gridCustom.css
---

```js
//import proj4 from 'proj4'; // for UTM conversion
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
//const sitesIn = FileAttachment("data/Copy of Sites_all_UTM.csv").csv({typed: true});
```

```js
//Copied from C:\Users\bletcher\OneDrive - DOI\PITTAGMAIN\West Brook data\
const coordsIn = FileAttachment("data/WBCoordsForD3JS_NHDHRsnapped.csv").csv({typed: true});

//const cdwbIn = FileAttachment("data/parquet/part-0.parquet").parquet();
```

```js
const cdwb = [...cdwbIn];

const formatTimeJ = d3.timeFormat("%j");
const formatTimeHour = d3.timeFormat("%H");
const formatTimeMinute = d3.timeFormat("%M");
//formatTime(new Date()); // "May 31, 2023"

cdwb.forEach(d => {
  const detectionDate = new Date(d.detectionDate); 
  const dateEmigrated = new Date(d.dateEmigrated); 
  d.detectionDate = detectionDate;
  d.dateEmigrated = dateEmigrated;
  d.j = Number(formatTimeJ(d.detectionDate));
  d.hour = Number(formatTimeHour(d.detectionDate));
  d.minute = Number(formatTimeMinute(d.detectionDate));
  //d.title = d.tag
});

const cdwbAntenna0 = cdwb.filter(d => d.survey === "stationaryAntenna");
```

```js
const cdwbAntenna = selectedGrouping === "None" ? cdwbAntenna0
  : selectedGrouping === "Day" ? d3.groups(cdwbAntenna0, d => `${d.tag}_${d.year}_${d.j}_${d.survey}_${d.riverMeter}_${d.riverOrdered}`).map(([key, group]) => group[0])
  : selectedGrouping === "Hour" ? d3.groups(cdwbAntenna0, d => `${d.tag}_${d.year}_${d.j}_${d.hour}_${d.survey}_${d.riverMeter}_${d.riverOrdered}`).map(([key, group]) => group[0])
  : selectedGrouping === "Minute" ? d3.groups(cdwbAntenna0, d => `${d.tag}_${d.year}_${d.j}_${d.hour}_${d.minute}_${d.survey}_${d.riverMeter}_${d.riverOrdered}`).map(([key, group]) => group[0])
  : cdwbAntenna0
```

```js
const species = [...new Set(cdwbAntenna.map(d => d.species))].sort();
const filteredSpeciesMap = new Map(
  Array.from(speciesMap).filter(([key, value]) => species.includes(value))
);
const selectSpecies = (Inputs.select(filteredSpeciesMap, {value: species, multiple: true, width: 10}));
const selectedSpecies = Generators.input(selectSpecies);
```

```js
const cdwbAntennaSpecies = cdwbAntenna.filter(
  d => selectedSpecies.includes(d.species)        
)
```

```js
const years = [...new Set(cdwbAntennaSpecies.map(d => d.year))].sort().filter(d => isFinite(d));
const selectYears = (Inputs.select(years, {value: years, multiple: 6, width: 10}));
const selectedYears = Generators.input(selectYears);
```

```js
const cdwbAntennaSpeciesYears = cdwbAntennaSpecies.filter(
  d => selectedYears.includes(d.year)        
);
```

```js
const rivers = [...new Set(cdwbAntennaSpeciesYears.map(d => d.riverOrdered))].sort();
const filteredRiversMap = new Map(
  Array.from(riversMap).filter(([key, value]) => rivers.includes(value))
);
const selectRivers = (Inputs.select(filteredRiversMap, {value: rivers, multiple: true, width: 10}));
const selectedRivers = Generators.input(selectRivers);
```

```js
const cdwbAntennaSpeciesYearsRiver = cdwbAntennaSpeciesYears.filter(
  d => selectedRivers.includes(d.riverOrdered)        
)
```

```js
const riverMeters = [...new Set(cdwbAntennaSpeciesYearsRiver.map(d => `${d.riverMeter}_${d.riverOrdered}`))].sort();
const selectRiverMeters = (Inputs.select(riverMeters, {value: riverMeters, multiple: 5, width: 30}));
const selectedRiverMeters = Generators.input(selectRiverMeters);
```

```js
const cdwbAntennaSpeciesYearsRiverRiverMeters = cdwbAntennaSpeciesYearsRiver.filter(
  d => selectedRiverMeters.includes(`${d.riverMeter}_${d.riverOrdered}`)        
)
```

```js
//const interval = d3.range(1, 31, 1);
const selectInterval = (Inputs.range([1, 31], {value: 1, step: 1, width: 10}));
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

const selectGrouping = (Inputs.select(["None", "Day", "Hour", "Minute"], {value: "None", width: 5}));
const selectedGrouping = Generators.input(selectGrouping);
```

<div class="wrapper2">
  <div class="card antSelectors">
    <h1 style="margin-bottom: 20px"><strong>Filter data</strong></h1>
      <div style="display: flex; align-items: center; gap: 15px">
        Group individuals by? <span>${view(selectGrouping)}</span>
      </div>
      <hr>
      <div style="margin-top: 0px">
      <h2>Select species:</h2>
      <div style="display: flex; align-items: center; gap: 15px">
        ${view(selectSpecies)} <span>n = ${cdwbAntennaSpecies.length}</span>
      </div>
    </div>
    <div style="margin-top: 20px">
      <h2>Select year(s):</h2>
      <div style="display: flex; align-items: center; gap: 15px">
        ${view(selectYears)} <span>n = ${cdwbAntennaSpeciesYears.length}</span>
      </div>
    </div>
    <div style="margin-top: 20px">
      <h2>Select river(s):</h2>
      <div style="display: flex; align-items: center; gap: 15px">
        ${view(selectRivers)} <span>n = ${cdwbAntennaSpeciesYearsRiver.length}</span>
      </div>
    </div>
    <div style="margin-top: 20px">
      <h2>Select antenna (river meter):</h2>
        <div style="display: flex; align-items: center; gap: 15px">
        ${view(selectRiverMeters)} <span>n = ${cdwbAntennaSpeciesYearsRiverRiverMeters.length}</span>
      </div>
    </div>
    <hr>
    <div style="margin-top: 2px">
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
      cdwbAntennaSpeciesYearsRiverRiverMeters,
      selectedInterval,
      selectedFillVar,
      width
    )}
  </div>
</div>

cdwbAntennaSpeciesYearsRiverRiverMeters
```js
cdwbAntennaSpeciesYearsRiverRiverMeters
```

dateRange
```js
const dateRange = d3.extent(cdwbAntennaSpeciesYearsRiverRiverMeters, d => d.detectionDate);
display(dateRange)
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
import { baseMap, addMarkers, addClickListenersToMarkers, updateMarkerStyles, addMapClickListener } from "./components/antennaDataFunctions.js";
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
addMapClickListener(map1);
```









```js
/*
function convertUTMToLatLon(easting, northing, zone) {
    const utmProj = `+proj=utm +zone=${zone} +datum=WGS84 +units=m +no_defs`;
    const latLonProj = '+proj=longlat +datum=WGS84 +no_defs';
    return proj4(utmProj, latLonProj, [easting, northing]);
}
*/

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
//sitesIn
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


