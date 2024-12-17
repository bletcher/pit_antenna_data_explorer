---
theme: dashboard
toc: false
style: gridCustom.css
---

```js
//import proj4 from 'proj4'; // for UTM conversion
```

```js
import {antennaDataGraph, antennaMapGraph} from "./components/antennaDataGraphs.js";
import {speciesMap, riversMap, variablesMapAnt, variablesMapAntNoNull, riversMapFromDeploy} from "./components/maps.js";
//import {interval} from 'https://observablehq.com/@mootari/range-slider';
```

```js
//const cdwb = FileAttachment("data/all_for_obs.csv").csv({typed: true});
const cdwbIn = FileAttachment("data/cdwb.json").json(); // this is a lot faster than the parquet file

// file created from `C:\Users\bletcher\OneDrive - DOI\PITTAGMAIN\West Brook data\Antenna data\Copy of sites.xlsx`, saved as a csv and copied to the data folder
//const sitesIn = FileAttachment("data/Copy of Sites_all_UTM.csv").csv({typed: true});
```

```js
//Copied from c:\Users\bletcher\OneDrive - DOI\projects\wbBook_quarto_targets\data\outForDownload\antenna
// after adding lat and lon to the deploy file
const deployIn = FileAttachment("data/deploy_with_lat_lon_added.csv").csv({typed: true});
const antennaLocationsHistoryIn = FileAttachment("data/antennaLocationsHistory.csv").csv({typed: true});
```

```js
const envDataIn = FileAttachment("data/envDataWB.json").json();
```

```js
//Copied from C:\Users\bletcher\OneDrive - DOI\PITTAGMAIN\West Brook data\
const coordsIn = FileAttachment("data/WBCoordsForD3JS_NHDHRsnapped.csv").csv({typed: true});
```

```js
//CSV saved from xls with the same file name. These are updated opints from Todd in 2024
const coordsInTodd = FileAttachment("data/West Brook_Lat Long Points_20241210.csv").csv({typed: true});
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
  d.riverMeter_river = `${d.riverMeter}_${d.riverOrdered}`;
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
);
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

const envDataSpeciesYears = envDataIn.filter(
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
);

const envDataSpeciesYearsRiver = envDataSpeciesYears.filter(
  d => selectedRivers.includes(d.riverOrdered)        
);
```

```js
const riverMeters = [...new Set(cdwbAntennaSpeciesYearsRiver.map(d => d.riverMeter_river))].sort();
const selectRiverMeters = (Inputs.select(riverMeters, {value: riverMeters, multiple: 5, width: 30}));
const selectedRiverMeters = Generators.input(selectRiverMeters);
```

```js
const cdwbAntennaSpeciesYearsRiverRiverMeters = cdwbAntennaSpeciesYearsRiver.filter(
  d => selectedRiverMeters.includes(d.riverMeter_river)        
);
```

```js
//const interval = d3.range(1, 31, 1);
const selectInterval = (Inputs.range([1, 31], {value: 1, step: 1, width: 10}));
const selectedInterval = Generators.input(selectInterval);

const selectWidth = (Inputs.range([1000, 10000], {value: 1150, step: 100, width: 10}));
const selectedWidth = Generators.input(selectWidth);

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

const selectFacet = (Inputs.radio([true, false], {value: false, width: 5}));
const selectedFacet = Generators.input(selectFacet);

const selectFlowX = (Inputs.range([0, 200], {value: 1, step: 1, width: 10}));
const selectedFlowX = Generators.input(selectFlowX);
```

<div class="wrapper2">
  <div class="card antSelectors">
    <h1 style="margin-bottom: 12px"><strong>Filter data</strong></h1>
      <div style="display: flex; align-items: center; gap: 15px;">
        Group individuals by? <span>${view(selectGrouping)}</span>
      </div>
      <hr style="margin-top: 0px; margin-bottom: 0px">
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
    <hr style="margin-top: 5px; margin-bottom: 0px">
    <div style="margin-top: 2px">
      <h2>Select plotting width:</h2>
      ${view(selectWidth)}
    </div>
    <h2>
      <div style="display: flex; align-items: center; gap: 15px; margin-top: 10px">
        Select color var: <span>${view(selectFillVar)}</span>
      </div>
    </h2>
    <div style="margin-top: 20px">
    <h2>Facet graph by river (and add flow)?</h2>
      ${view(selectFacet)}
    </div>
    <div style="margin-top: 20px">
    <h2>Flow multiplier:</h2>
      ${view(selectFlowX)}
    </div>
  </div>
  <div class="card antGraph">
    ${antennaDataGraph(
      cdwbAntennaSpeciesYearsRiverRiverMeters,
      envDataSpeciesYearsRiver,
      selectedWidth,
      selectedFillVar,
      selectedFacet,
      selectedFlowX,
      width
    )}
  </div>
</div>

```js
cdwbAntennaSpeciesYearsRiverRiverMeters
```

```js
const dateRange = d3.extent(cdwbAntennaSpeciesYearsRiverRiverMeters, d => d.detectionDate);
//display(dateRange)
```

---

```js
coordsIn.forEach(d => {
  d.siteID = `${d.riverAbbr}_${d.section}`;
  d.lat = d.snap_lat;
  d.lon = d.snap_lon;
  //d.title = d.tag
});
```


```js
const deploy = deployIn.map(d => ({
  section: d.section || null,
  lat: d.lat === "NA" || d.lat === "" ? null : Number(d.lat),
  lon: d.lon === "NA" || d.lon === "" ? null : Number(d.lon),
  antenna_name: d.antenna_name || "Unknown",
  deployed: d.deployed === "NA" || d.deployed === "" || !d.deployed ? null : new Date(d.deployed),
  removed: d.removed === "NA" || d.removed === "" || !d.removed ? null : new Date(d.removed),
  riverAbbr: d.riverAbbr || null,
  angle: d.angle || null,
  riverMeter_river: `${d.riverMeter}_${riversMapFromDeploy.get(d.river)}` || null
})).filter(d => d.lat != null && d.lon != null);

const antennaLocationsHistory = antennaLocationsHistoryIn.map(d => ({
  lat: d.lat === "NA" || d.lat === "" ? null : Number(d.lat),
  lon: d.lon === "NA" || d.lon === "" ? null : Number(d.lon),
  antenna_name: d.antenna_name || "Unknown",
  deployed: d.observableFirstDate === "NA" || d.observableFirstDate === "" || !d.observableFirstDate ? null : new Date(d.observableFirstDate),
  removed: d.observableLastDate === "NA" || d.observableLastDate === "" || !d.observableLastDate ? null : new Date(d.observableLastDate),
  riverAbbr: d.riverAbbr || null,
  angle: d.angle || null,
  // Add any other fields you need, but NOT firstSlideNum
})).filter(d => d.lat != null && d.lon != null);

const selectAntennaDataIn = (Inputs.select(["deploy", "antennaLocationsHistory",], {value: "deploy", width: 40}));
const selectedAntennaDataIn = Generators.input(selectAntennaDataIn);//const antennaLocations = [...deploy, ...antennaLocationsHistory];
```

```js
const antennaDataLocations = selectedAntennaDataIn === "deploy" ? deploy : antennaLocationsHistory;
```

```js
// Get date extent from deploy data
const dateExtent = d3.extent([
  ...antennaDataLocations.map(d => d.deployed),
  ...antennaDataLocations.map(d => d.removed)
]);

// Create array of all dates in range
const dateRangeAntenna = d3.timeDay.range(dateExtent[0], dateExtent[1]);

// Create date slider using the array of dates
const selectAntennaDate = Inputs.range([0, dateRangeAntenna.length - 1], {
  value: 0,
  step: 1,
  width: 400
});

const selectedAntennaDate = Generators.input(selectAntennaDate);
```

```js
// Filter deploy data based on selected date
const activeAntennas = antennaDataLocations.filter(d => {
  const deployedDate = new Date(d.deployed);
  const removedDate = new Date(d.removed);
  return selectedAntennaDateDate >= deployedDate && selectedAntennaDateDate <= removedDate;
});
//display(activeAntennas)
```

```js
const selectedAntennaDateDate = dateRangeAntenna[selectedAntennaDate];
//display(selectedAntennaDateDate)
```

```js
/////////
// Map //
/////////
import { baseMap, addMarkers, addMarkersTodd, addClickListenersToMarkers, updateMarkerStyles, addMapClickListener, addAntennas, clearAntennaSelections, selectAllAntennas, addButtonControl, updateButtonHandlers, antMapGraph } from "./components/antennaDataFunctions.js";
```

  <div style="margin-top: 20px">
    <h3>Select antenna location input file:</h3>
    ${selectAntennaDataIn}
  </div>
  <style>
    .observablehq input[type="number"] {
      display: none !important;
    }
  </style>
  <div style="margin-top: 20px">
    <h3>Select date to show antennas on the map:</h3>
    <div style="display: flex; align-items: center; gap: 15px">
      <span>${d3.timeFormat("%Y-%m-%d")(selectedAntennaDateDate)}</span>
      ${view(selectAntennaDate)}
    </div>
  </div>
  <div class="wrapper2">
    <div class="card antMap">
      ${div_map1}
    </div>
    <div class="card antMapGraph">
      there could be a graph here, but updating it based on the date slider is a slow
    <!--
      ${antennaMapGraph(
        cdwbAntennaMap,
        selectedInterval,
        selectedFillVar,
        width
      )}
    -->
    </div>
  </div>
</div>

```js
/////////
// Map //
/////////

  const lat1 = 42.4344;
  const lon1 = -72.661;
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
baseMap.USGS_hydro_detail.addTo(map1);

// Remove any existing controls
map1.eachLayer(layer => {
  if (layer instanceof L.Control) {
    map1.removeControl(layer);
  }
});

// Add the button control
const buttonControl = addButtonControl(map1);
```

```js

```

```js
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

let markers = addMarkers(coordsIn.filter(d => d.lat != null && d.lon != null), map1);
let toddMarkers = addMarkersTodd(coordsInTodd.filter(d => d.lat != null && d.lon != null), map1);

// Merge toddMarkers into markers layer group
if (toddMarkers instanceof L.LayerGroup) {
    toddMarkers.eachLayer(layer => {
        markers.addLayer(layer);
    });
} else if (toddMarkers instanceof L.Layer) {
    markers.addLayer(toddMarkers);
}

let markersSelected = Mutable([initialSite]);
addClickListenersToMarkers(markers, markersSelected);
updateMarkerStyles(markers);
addMapClickListener(map1);
```

```js
let antennasSelected = Mutable(activeAntennas.map(d => d.riverMeter_river));

// Clear any existing antenna layers and add new ones
map1.eachLayer(layer => {
  if (layer instanceof L.LayerGroup) {
    layer.clearLayers();
  }
});

const antennaResult = addAntennas(activeAntennas, map1, antennasSelected);
updateButtonHandlers(buttonControl, antennaResult.markers, antennasSelected);
```

```js
//const cdwbAntennaMap = cdwbAntennaSpeciesYearsRiverRiverMeters.filter(d => antennasSelected.includes(d.riverMeter_river));
```

```js

```

```js
//cdwbAntennaMap
```

```js
//antennasSelected
```

```js
//activeAntennas
```
