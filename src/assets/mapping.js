export var setMap = function (city, zoom=11) {

  var map = L.mapbox.map("mapbox", null, {
    center: [city.latitude, city.longitude],
    reuseTiles: true,
    zoom: zoom,
    zoomControl: false,
    scrollWheelZoom: false
  });


  new L.Control.Zoom({ position: "topleft" }).addTo(map);

  L.mapbox
    .styleLayer("mapbox://styles/willcmccusker/cj44oki3u843e2rnx1wyilp8z")
    .addTo(map);

  // Add labels
  L.mapbox.
    styleLayer("mapbox://styles/willcmccusker/cj1s19z2u000l2snsh0t9i8gw")
    .addTo(map);

  return map;
}
