import * as d3 from "npm:d3";

// Copied from /airWaterTemperatureViewer/docs/components/mapVariablesRaw.js

// Map functions //////////////////////////////////////////////////////////////

export const baseMap = {
  USGS_hydro: L.tileLayer(
    'https://basemap.nationalmap.gov/arcgis/rest/services/USGSHydroCached/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: '<a href="http://www.doi.gov">U.S. Department of the Interior</a> | <a href="http://www.usgs.gov">U.S. Geological Survey</a> | <a href="http://www.usgs.gov/laws/policies_notices.html">Policies</a>',
      maxZoom: 20
    }
  ),
  StreetView: L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',   
    {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
  ),
  Topography: L.tileLayer.wms(
    'http://ows.mundialis.de/services/service?',   
    {layers: 'TOPO-WMS'}
  ),
  Places: L.tileLayer.wms(
    'http://ows.mundialis.de/services/service?', 
    {layers: 'OSM-Overlay-WMS'}
  ),
  USGS_USImagery: L.tileLayer(
    'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
    {
      maxZoom: 20,
      attribution:
      'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
    }
  )
};

const getColorByRiverAbbr = (riverAbbr) => {
    
  const colorMap = {
    'WB': '#FF0000', // Red
    'OL': '#00FF00', // Green
    'OS': '#FFA500', // Orange
    'IL': '#0000FF' // Blue
  };
  //console.log("riverAbbr", riverAbbr, colorMap[riverAbbr])
  return colorMap[riverAbbr] || '#000000';
};

export function addMarkers(dIn, map1) {
  let markers = [];

  dIn.forEach(function(d) {
    let marker = L.circleMarker([d.lat, d.lon], {
      color: getColorByRiverAbbr(d.riverAbbr),
      fillColor: getColorByRiverAbbr(d.riverAbbr),
      fillOpacity: 0.25,
      radius: 5
    }).addTo(map1);

    // Add a 'selected' property to the marker
    marker.selected = false;
    marker.siteID = d.siteID;
    marker.riverAbbr = d.riverAbbr;

    markers.push(marker);
  });
  return markers;
};

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