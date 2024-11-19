import * as d3 from "npm:d3";

// Copied from /airWaterTemperatureViewer/docs/components/mapVariablesRaw.js

// Map functions //////////////////////////////////////////////////////////////

export const baseMap = {
  USGS_hydro_detail: L.tileLayer.wms('https://hydro.nationalmap.gov/arcgis/services/nhd/MapServer/WMSServer', {
    layers: '6,7,8,9', // Including multiple detail levels of streams
    format: 'image/png',
    transparent: true,
    attribution: '<a href="https://www.doi.gov">U.S. Department of the Interior</a> | <a href="https://www.usgs.gov">U.S. Geological Survey</a> | <a href="https://www.usgs.gov/policies-and-notices">Policies</a>',
    maxZoom: 20,
    minZoom: 0
  }),
  USGS_hydro: L.tileLayer(
    'https://basemap.nationalmap.gov/arcgis/rest/services/USGSHydroCached/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: '<a href="https://www.doi.gov">U.S. Department of the Interior</a> | <a href="https://www.usgs.gov">U.S. Geological Survey</a> | <a href="https://www.usgs.gov/policies-and-notices">Policies</a>',
      maxZoom: 20
    }
  ),
  USGS_3dhp: L.tileLayer(
    'https://hydro.nationalmap.gov/arcgis/rest/services/3DHP_all/MapServer/tile/{z}/{y}/{x}',
    {
      //layers: '6,7,8,9',
      attribution: '<a href="https://www.doi.gov">U.S. Department of the Interior</a> | <a href="https://www.usgs.gov">U.S. Geological Survey</a> | <a href="https://www.usgs.gov/policies-and-notices">Policies</a>',
      maxZoom: 20
    }
  ),
  OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }),
  USGS_USImagery: L.tileLayer(
    'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
    {
      maxZoom: 20,
      attribution:
      'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
    }
  ),
  Satellite: L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 20
    }
  )
};

const getColorByRiverAbbr = (riverAbbr) => {
    
  const colorMap = {
    'WB': '#d36135', 
    'OL': '#7fb069', 
    'OS': '#00798c', 
    'IL': '#e6aa68' 
  };
  //console.log("riverAbbr", riverAbbr, colorMap[riverAbbr])
  return colorMap[riverAbbr] || '#000000';
};

export function addMarkers(dIn, map1) {
  let markers = [];

  dIn.forEach(function(d) {
    let marker = L.circleMarker([d.snap_lat, d.snap_lon], {
      color: getColorByRiverAbbr(d.riverAbbr),
      fillColor: getColorByRiverAbbr(d.riverAbbr),
      fillOpacity: 0.25,
      radius: 5
    }).addTo(map1);

    // Add a 'selected' property to the marker
    marker.selected = false;
    marker.siteID = d.siteID;
    marker.riverAbbr = d.riverAbbr;

    // Add mouseover popup with explicit options
    const popup = L.popup({
      closeButton: false,
      offset: [0, -5]
    }).setContent(`Section: ${d.section}`);
    
    marker.bindPopup(popup);
    marker.on('mouseover', function(e) {
      this.openPopup();
    });
    marker.on('mouseout', function(e) {
      this.closePopup();
    });

    markers.push(marker);
  });
  return markers;
};

export function addAntennas(activeAntennas, map1) {
  const antennaLayer = L.layerGroup();

  activeAntennas.forEach(d => {
    // Create custom divIcon with rotated line
    const antennaIcon = L.divIcon({
      className: 'antenna-marker',
      html: `<div style="
        width: 3px; 
        height: 20px; 
        background-color: darkred;
        transform: rotate(${d.angle || 0}deg);
        transform-origin: center;
      "></div>`,
      iconSize: [4, 20],
      iconAnchor: [2, 10]
    });

    const marker = L.marker([d.lat, d.lon], {
      icon: antennaIcon
    });

    const popup = L.popup({
      closeButton: false,
      offset: [0, -5]
    }).setContent(`
      Antenna: ${d.antenna_name}<br>
      Deployed: ${d3.timeFormat("%Y-%m-%d")(new Date(d.deployed))}<br>
      Removed: ${d3.timeFormat("%Y-%m-%d")(new Date(d.removed))}<br>
      Angle: ${d.angle || 0}°
    `);
    
    marker.bindPopup(popup);
    marker.on('mouseover', e => marker.openPopup());
    marker.on('mouseout', e => marker.closePopup());
    
    marker.addTo(antennaLayer);
  });

  antennaLayer.addTo(map1);
  return antennaLayer;
}

export function addClickListenersToMarkers(markers, markersSelected) {
  markers.forEach(function(marker) {
    // Add a click event listener to the marker
    marker.on('click', function() {
      console.log("marker", marker)
      // Toggle the 'selected' property
      this.selected = !this.selected;

      markersSelected.value = markers.filter(d => d.selected).map(d => d.siteID)
      console.log("marker2", markersSelected.value)
      // Update the marker styles
      updateMarkerStyles(markers);
    });
  });

  return(markersSelected);
};

export function updateMarkerStyles(markers) {
  markers.forEach(function(marker) {
    //console.log(marker)
    if (marker.selected) {
      marker.setStyle({
        color: getColorByRiverAbbr(marker.riverAbbr),
        fillColor: getColorByRiverAbbr(marker.riverAbbr),
        radius: 10
      });
    } else {
      marker.setStyle({
        color: getColorByRiverAbbr(marker.riverAbbr),
        fillColor: getColorByRiverAbbr(marker.riverAbbr),
        radius: 5
      });
    }
  });
  //console.log("updateMarkerStyle", markersSelected.value, markers.filter(d => d.selected).map(d => d.siteID))
  return(markers);
};

export function addMapClickListener(map1) {
  map1.on('dblclick', function(e) {
    // Prevent the default double-click zoom behavior
    L.DomEvent.stopPropagation(e);
    L.DomEvent.preventDefault(e);
    
    const lat = e.latlng.lat.toFixed(10);
    const lng = e.latlng.lng.toFixed(10);
    L.popup()
      .setLatLng(e.latlng)
      .setContent(`Lat: ${lat}<br>Lon: ${lng}`)
      .openOn(map1);
  });
  
  // Disable double click zoom entirely
  map1.doubleClickZoom.disable();
}