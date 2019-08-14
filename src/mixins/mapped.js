const mapped = {
  data() {
    return {}
  },
  methods: {
    attachMap(){
      this.map = L.mapbox.map("mapbox", null, {
        center: [this.city.City.latitude, this.city.City.longitude],
        reuseTiles: true,
        zoom: 13,
        zoomControl: false,
        scrollWheelZoom: false
      });

      new L.Control.Zoom({ position: "topleft" }).addTo(this.map);

      this.lightBG = L.mapbox
        .styleLayer("mapbox://styles/willcmccusker/cj44oki3u843e2rnx1wyilp8z")
        .addTo(this.map);
      this.labelsMap = L.mapbox
        .styleLayer("mapbox://styles/willcmccusker/cj1s19z2u000l2snsh0t9i8gw")
        .addTo(this.map);
    }
  },
  mounted() {
    this.attachMap()
  }
}
