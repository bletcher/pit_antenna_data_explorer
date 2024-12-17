---
theme: dashboard
toc: false
style: gridCustom.css
---

// 1. Imports
```js
import {antennaData} from "./components/antennaDataGraphs.js";
import {speciesMap, riversMap, variablesMapAnt, variablesMapAntNoNull} from "./components/maps.js";
import { baseMap, addMarkers, addClickListenersToMarkers, updateMarkerStyles, addMapClickListener, addAntennas, clearAntennaSelections, selectAllAntennas, addButtonControl, updateButtonHandlers } from "./components/antennaDataFunctions.js";
```

// 2. Data Loading
```js
const cdwbIn = FileAttachment("data/cdwb.json").json();
const deployIn = FileAttachment("data/deploy_with_lat_lon_added.csv").csv({typed: true});
const antennaLocationsHistoryIn = FileAttachment("data/antennaLocationsHistory.csv").csv({typed: true});
const coordsIn = FileAttachment("data/WBCoordsForD3JS_NHDHRsnapped.csv").csv({typed: true});
```

// 3. Data Processing
```js
// Process CDWB data
const cdwb = [...cdwbIn];
cdwb.forEach(d => {
  const detectionDate = new Date(d.detectionDate); 
  const dateEmigrated = new Date(d.dateEmigrated); 
  d.detectionDate = detectionDate;
  d.dateEmigrated = dateEmigrated;
  d.j = Number(d3.timeFormat("%j")(d.detectionDate));
  d.hour = Number(d3.timeFormat("%H")(d.detectionDate));
  d.minute = Number(d3.timeFormat("%M")(d.detectionDate));
});

// Filter for antenna data
const cdwbAntenna0 = cdwb.filter(d => d.survey === "stationaryAntenna");
```

// 4. UI Controls Setup
```js
// Grouping selector
const selectGrouping = Inputs.select(["None", "Day", "Hour", "Minute"], {value: "None", width: 5});
const selectedGrouping = Generators.input(selectGrouping);

// Data grouping based on selection
const cdwbAntenna = selectedGrouping === "None" ? cdwbAntenna0
  : selectedGrouping === "Day" ? d3.groups(cdwbAntenna0, d => `${d.tag}_${d.year}_${d.j}_${d.survey}_${d.riverMeter}_${d.riverOrdered}`).map(([key, group]) => group[0])
  : selectedGrouping === "Hour" ? d3.groups(cdwbAntenna0, d => `${d.tag}_${d.year}_${d.j}_${d.hour}_${d.survey}_${d.riverMeter}_${d.riverOrdered}`).map(([key, group]) => group[0])
  : selectedGrouping === "Minute" ? d3.groups(cdwbAntenna0, d => `${d.tag}_${d.year}_${d.j}_${d.hour}_${d.minute}_${d.survey}_${d.riverMeter}_${d.riverOrdered}`).map(([key, group]) => group[0])
  : cdwbAntenna0;

// Species selector
const species = [...new Set(cdwbAntenna.map(d => d.species))].sort();
const filteredSpeciesMap = new Map(Array.from(speciesMap).filter(([key, value]) => species.includes(value)));
const selectSpecies = Inputs.select(filteredSpeciesMap, {value: species, multiple: true, width: 10});
const selectedSpecies = Generators.input(selectSpecies);
const cdwbAntennaSpecies = cdwbAntenna.filter(d => selectedSpecies.includes(d.species));

// Year selector
const years = [...new Set(cdwbAntennaSpecies.map(d => d.year))].sort().filter(d => isFinite(d));
const selectYears = Inputs.select(years, {value: years, multiple: 6, width: 10});
const selectedYears = Generators.input(selectYears);
const cdwbAntennaSpeciesYears = cdwbAntennaSpecies.filter(d => selectedYears.includes(d.year));

// River selector
const rivers = [...new Set(cdwbAntennaSpeciesYears.map(d => d.riverOrdered))].sort();
const filteredRiversMap = new Map(Array.from(riversMap).filter(([key, value]) => rivers.includes(value)));
const selectRivers = Inputs.select(filteredRiversMap, {value: rivers, multiple: true, width: 10});
const selectedRivers = Generators.input(selectRivers);
const cdwbAntennaSpeciesYearsRiver = cdwbAntennaSpeciesYears.filter(d => selectedRivers.includes(d.riverOrdered));

// River meter selector
const riverMeters = [...new Set(cdwbAntennaSpeciesYearsRiver.map(d => `${d.riverMeter}_${d.riverOrdered}`))].sort();
const selectRiverMeters = Inputs.select(riverMeters, {value: riverMeters, multiple: 5, width: 30});
const selectedRiverMeters = Generators.input(selectRiverMeters);
const cdwbAntennaSpeciesYearsRiverRiverMeters = cdwbAntennaSpeciesYearsRiver.filter(d => selectedRiverMeters.includes(`${d.riverMeter}_${d.riverOrdered}`));
```

// 5. Map Setup
```js
const lat1 = 42.4344;
const lon1 = -72.67;
const mag1 = 16.4;

const div_map1 = display(document.createElement("div"));
div_map1.style = "height: 750px;";

const map1 = L.map(div_map1).setView([lat1, lon1], mag1);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map1);

L.control.layers(baseMap).addTo(map1);
baseMap.USGS_hydro_detail.addTo(map1);

// Clear existing controls and add new ones
map1.eachLayer(layer => {
  if (layer instanceof L.Control) {
    map1.removeControl(layer);
  }
});

const buttonControl = addButtonControl(map1);
```

// 6. Antenna Data Processing and Display
```js
const deploy = deployIn.map(d => ({
  lat: d.lat === "NA" || d.lat === "" ? null : Number(d.lat),
  lon: d.lon === "NA" || d.lon === "" ? null : Number(d.lon),
  antenna_name: d.antenna_name || "Unknown",
  deployed: d.deployed === "NA" || d.deployed === "" || !d.deployed ? null : new Date(d.deployed),
  removed: d.removed === "NA" || d.removed === "" || !d.removed ? null : new Date(d.removed),
  riverAbbr: d.riverAbbr || null,
  angle: d.angle || null,
})).filter(d => d.lat != null && d.lon != null);

// Initialize antenna selection
let antennasSelected = Mutable(activeAntennas.map(d => d.antenna_name));

// Clear existing antenna layers
map1.eachLayer(layer => {
  if (layer instanceof L.LayerGroup) {
    layer.clearLayers();
  }
});

const antennaResult = addAntennas(activeAntennas, map1, antennasSelected);
updateButtonHandlers(buttonControl, antennaResult.markers, antennasSelected);
```

// 7. UI Layout
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
```

</rewritten_file>








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

