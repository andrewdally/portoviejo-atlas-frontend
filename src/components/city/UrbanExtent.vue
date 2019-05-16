<template>
  <div>
    <div class="row">
      <div class="col-lg-6 order-last mapbox-outer-wrap">
        <div id='map-key' class="border shadow-sm">
          <div v-if="extraLayersVisible" class='map-key-years'>
            <div class='map-key-year form-check' v-for='year in years' :key='"comp_" + year'>
              <input class="form-check-input" type="radio" v-model='compositionYear' v-bind:value='year' v-bind:id='year + "_check"' >
              <label class="form-check-label" v-bind:for='year + "_check"' v-html='year'></label>
            </div>
          </div>
          <div v-else="extraLayersVisible" class='map-key-years'>
            <div class='map-key-year' v-for='year in years' :key='"ext_" + year'>
              <label>
                {{year}}
                <input class="checkbox" type="checkbox" v-model='extentYears' v-bind:value='year' v-bind:id='year + "_check"' >
                <span class="checkmark"></span>
              </label>
            </div>
          </div>
          <div class='cursor showLayers' @click='extraLayersVisible = !extraLayersVisible'>{{extraLayersVisible ? 'Hide': 'Show'}} Urban Composition</div>
          <div v-if='extraLayersVisible' class='map-key-layers '>
            <div class='form-check' v-for='layer in layers'>
              <input class="form-check-input" type="checkbox" v-model='layer.on' v-bind:id='layer.name + "_check"' @click="toggleLayer()" >
              <label class="form-check-label" v-bind:for='layer.name + "_check"' v-html='layer.display'></label>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mapbox-inner-wrap">
          <div id="mapbox"></div>
        </div>
      </div>
      <div id="cityData" class="col-lg-6 order-first">
        <h1 class="mt-5 mb-2">Huella Urbana</h1>
        <div class="row pb-4 pt-4 mb-4 border-top border-bottom">
          <div class="col-4">
            <big-num heading='1985' number='1,155' units='Hectáreas' color='#2e2e76'/>
          </div>
          <div class="col-4 text-left">
            <big-num heading='1998' number='2,254' units='Hectáreas' color='#ac2341'/>
          </div>
          <div class="col-4 text-left">
            <big-num heading='2017' number='5,176' units='Hectáreas' color='#da8b40'/>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-lg-12">
            <p> The urban extent of Portoviejo in 2017 was 5,176 hectares, increasing at an average annual rate of 4.45% since 1998. The urban extent in 1998 was 2,254 hectares, increasing at an average annual rate of 4.95% since 1985, when its urban extent was 1,115 hectares. </p>
          </div>
          <div class="col-md-6 col-lg-12">
            <p>Urban extent is the combined built-up area and open space associated a city at a given date. The urban extent is derived by applying an "inclusion rule" to urban clusters across the study area.</p>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-top">
          <div class="col-12">
            <h3 class="mb-4">Average annual change</h3>
          </div>
          <div class="col-4">
            <big-num heading='1985-1998' number='4.95%' units='Average annual rate' color='#FF6A4D'/>
          </div>
          <div class="col-4">
            <big-num heading='1998-2017' number='4.45%' units='Average annual rate' color='#97928C'/>
          </div>
        </div>
        <div class="row border-bottom pb-4 mb-4">
          <div class="col-12">
            <canvas id='urban_extent_change_bar' class='city-graphic' />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <h3 class="mb-4">Urban Composition</h3>
          </div>
          <div class="col-12">
            <p>Urban extent can be further broken down into four categories of space: <strong style='color: white; padding: 0 5px; background-color: #2300BD;'><em>Urban built-up</em></strong>, <strong style='color: white; padding: 0 5px; background-color: #C2799F;'><em>Suburban built-up</em></strong>, <strong style='color: white; padding: 0 5px; background-color: #000;'><em>Rural built-up</em></strong>, and <strong style='padding: 0 5px; background-color: #FFFB29;'><em>Urbanized open space</em></strong>. Maybe a callout to toggle the Urban Composition map in the control panel on the right?</p>
          </div>
          <div class="col-12 mb-4 mt-4">
            <div>
              <canvas id='urban_extent_composition_stacked_bar' class='city-graphic'/>
            </div>
          </div>
          <div class="col-12">
            <p>Urban built-up pixels are the majority of built-up pixels (50% or more) in their Walking Distance Circle, defined as a circle with a one-square-kilometer area and a 584-meter radius, roughly a ten-minute walk—around each one of them. </p>
            <p>Suburban built-up pixels are 25–50% built-up pixels in their Walking Distance Circle, defined as a circle with a one-square-kilometer area and a 584-meter radius, roughly a ten-minute walk—around each one of them.</p>
            <p>Rural built-up pixels are less than 25% built-up pixels in their Walking Distance Circle, defined as a circle with a one-square-kilometer area and a 584-meter radius, roughly a ten-minute walk—around each one of them.</p>
            <p>All fringe open space and captured open space pixels associated with the urban extent. Fringe open space consists of all open space pixels within 100 meters of urban or suburban pixels; captured open space consists of all open space clusters that are fully surrounded by urban and suburban built-up pixels and the fringe open space pixels around them, and that are less than 200 hectares in area.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { makeChart, makeStacked } from '../../assets/graphing.js'
import BigNum from './BigNum'

export default {
  name: "UrbanExtent",
  //props: ['section', 'city'],
  data() {
    return {
      extraLayersVisible: false,
      city: window.city,
      chartObjects: {},
      laterYear: true,
      host: '{s}.atlasofurbanexpansion.org',
      years: [
        window.city.City.t1.substr(0, 4),
        window.city.City.t2.substr(0, 4),
        window.city.City.t3.substr(0, 4)
      ],
      extentYears: [
        window.city.City.t1.substr(0, 4),
        window.city.City.t2.substr(0, 4),
        window.city.City.t3.substr(0, 4)
      ],
      compositionYear: window.city.City.t3.substr(0, 4),
      activeCompositionLayers: [
        "extent_??_urbanBuilt",
        "extent_??_suburbanBuilt",
        "extent_??_ruralBuilt",
        "extent_??_urbanOpen",
        "extent_??_exurbanBuilt",
        "extent_??_exurbanOpen"
      ],
      allLayers: {},
      layers: [
        {
          on: true,
          display: "Urbano Edificado",
          name: "extent_??_urbanBuilt",
          url: "/urban_extent/urban_build_up_??/",
          color: "#978AD8"
        },
        {
          on: true,
          display: "Suburbano Edificado",
          name: "extent_??_suburbanBuilt",
          url: "/urban_extent/suburban_build_up_??/",
          color: "#DCB8CA"
        },
        {
          on: true,
          display: "Rural Edificado",
          name: "extent_??_ruralBuilt",
          url: "/urban_extent/rural_build_up_??/",
          color: "#7C7C7C"
        },
        {
          on: true,
          display: "Espacio Abierto Edificado",
          name: "extent_??_urbanOpen",
          url: "/urban_extent/open_space_??/",
          color: "#F6F5A4"
        },
        {
          on: true,
          display: "Área Exurbana Edificada",
          name: "extent_??_exurbanBuilt",
          url: "/urban_extent/exurban_built_up_??/",
          color: "#BCBCBC"
        },
        {
          on: true,
          display: "Espacio Abierto Exurbano",
          name: "extent_??_exurbanOpen",
          url: "/urban_extent/exurban_open_??/",
          color: "#E1E1E1"
        }
      ]
    };
  },
  computed: {
    layersFiltered() {
      return this.layers.filter(l => l.color);
    },
    yearsComputed() {
      return [
        {
          display: this.city.City.t1.substr(0, 4),
          checked: this.years[0].checked
        },
        {
          display: this.city.City.t2.substr(0, 4),
          checked: this.years[1].checked
        },
        {
          display: this.city.City.t3.substr(0, 4),
          checked: this.years[2].checked
        }
      ];
    }
  },
  mounted() {
    this.launchGraphs();
    this.map = L.mapbox.map("mapbox", null, {
      center: [this.city.City.latitude, this.city.City.longitude],
      reuseTiles: true,
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: false
    });

    new L.Control.Zoom({ position: "bottomright" }).addTo(this.map);

    this.lightBG = L.mapbox
      .styleLayer("mapbox://styles/willcmccusker/cj44oki3u843e2rnx1wyilp8z")
      .addTo(this.map);
    this.labelsMap = L.mapbox
      .styleLayer("mapbox://styles/willcmccusker/cj1s19z2u000l2snsh0t9i8gw")
      .addTo(this.map);
    this.setLayers();
    this.loadMapLayers();
    

  },
  destroyed() {
    this.destroyGraphs();
  },
  watch: {
    extentYears: function() {
      this.loadMapLayers()
    },
    compositionYear: function() {
      this.loadMapLayers()
    },
    extraLayersVisible: function () {
      this.loadMapLayers()
    },
    laterYear() {
      this.changeYear();
    }
  },
  methods: {
    toggleLayer() {
      var context = this
      setTimeout(function(){
        context.loadMapLayers()
      },1)
    },
    destroyGraphs() {
      for (var key in this.chartObjects) {
        if (this.chartObjects.hasOwnProperty(key)) {
          this.chartObjects[key].destroy();
        }
      }
    },
    canvas(id, width = "400px", height = "300px") {
      return (
        `<canvas id='` +
        id +
        `' class='city-graphic'  width="` +
        width +
        `" height="` +
        height +
        `"></canvas>`
      );
    },
    legend(id) {
      return this.chartObjects[id] && this.chartObjects[id].generateLegend();
    },
    launchGraphs() {
      let chart = {};

      let id = "urban_extent_composition_stacked_bar";
      if (this.chartObjects[id]) this.chartObjects[id].destroy();
      chart[id] = makeStacked(id, this.city, "Urban Composition");

      id = "urban_extent_change_bar";
      if (this.chartObjects[id]) this.chartObjects[id].destroy();
      chart[id] = makeChart(id, this.city, "Urban Extent Avg. Annual % Change");

      this.chartObjects = Object.assign({}, this.chartObjects, chart);
    },
    generateLayer(name, url, options) {
      return L.tileLayer(url, options);
    },
    layerStyle (layer) {
      return layer.on && {
        'background-color': layer.color
      }
    },
    getLayers () {
      var layers = []
      this.map.eachLayer((layer) => {
        if (layer.options.mine) {
          layers.push(layer)
        }
      })
      return layers
    },
    setLayers() {
      var options = {
        tms: true,
        subdomains: "abc",
        mine: true
        // maxZoom: 13
      };

      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < i + 1; j++) {
          var bound = j === 0 ? "inner" : j === 1 ? "middle" : "outer";
          var name = "t" + (i + 1) + "_" + bound;
          options.opacity = 0.7;
          options.name = "extent_" + name;
          if (!this.allLayers["extent_" + name]) {
            var u =
              "http://" +
              this.host +
              "/tiles/show/" +
              this.city.City.slug +
              "/extent/" +
              name +
              "/{z}/{x}/{y}.png";
            this.allLayers["extent_" + name] = this.generateLayer(
              name,
              u,
              options
            );
          }
        }
      }
      options.opacity = 1;
      this.addYearLayers(3, options);
    },
    addLayer (name) {
      if (this.allLayers[name]) {
        var layer = this.allLayers[name]
        if (!this.map.hasLayer(layer)) {
          this.map.addLayer(layer)
        }
        layer.bringToFront()
      }
    },
    addYearLayers(yearCount, options) {
      var inc = 0;
      for (var i = 1; i < yearCount + 1; i++) {
        var j = i - inc;
        this.layers.forEach((layerType) => {
          var name = layerType.name
            .replaceAll("??", "t" + j)
            .replace("!!", "t" + (j + 1));
          options.name = name;
          var url = layerType.url
            .replaceAll("??", "t" + j)
            .replace("!!", "t" + (j + 1));
          var u = "http://" +
            this.host +
            "/tiles/show/" +
            this.city.City.slug +
            url +
            "{z}/{x}/{y}.png";
          var layer = this.generateLayer(name, u, options);

          if (!this.allLayers[name]) {
            this.allLayers[name] = layer;
          }
        });
      }
    },
    setLabels() {
      if (this.labelsMap) {
        this.labelsMap.bringToFront();
      }
    },
    removeLayer (name) {
      if (this.allLayers[name]) {
        var layer = this.allLayers[name]
        if (this.map.hasLayer(layer)) {
          layer.bringToBack()
          this.map.removeLayer(layer)
        }
      }
    },
    loadMapLayers() {
      if (this.extraLayersVisible) {
        var timePeriod = "t" + (this.years.indexOf(this.compositionYear) + 1);
        var timePeriod_ = "t" + (this.years.indexOf(this.compositionYear) + 2);
        var layersToAdd = [];
        this.layers.forEach(layer => {
          if (layer.on) {
            layersToAdd.push(
              layer.name.replace("??", timePeriod).replace("!!", timePeriod_)
            );
          }
        });
      } else {
        var sequence = "";
        this.years.forEach(year => {
          sequence += this.extentYears.includes(year)  ? "1" : "0";
        });
        layersToAdd = [];
        switch (sequence) {
          case "000":
            break;
          case "100":
            layersToAdd.push("extent_t1_inner");
            break;
          case "110":
            layersToAdd.push("extent_t1_inner");
            layersToAdd.push("extent_t2_middle");
            break;
          case "101":
            layersToAdd.push("extent_t1_inner");
            layersToAdd.push("extent_t3_middle");
            layersToAdd.push("extent_t3_outer");
            break;
          case "111":
            layersToAdd.push("extent_t1_inner");
            layersToAdd.push("extent_t2_middle");
            layersToAdd.push("extent_t3_outer");
            break;
          case "010":
            layersToAdd.push("extent_t2_inner");
            layersToAdd.push("extent_t2_middle");
            break;
          case "011":
            layersToAdd.push("extent_t2_inner");
            layersToAdd.push("extent_t2_middle");
            layersToAdd.push("extent_t3_outer");
            break;
          case "001":
            layersToAdd.push("extent_t3_inner");
            layersToAdd.push("extent_t3_middle");
            layersToAdd.push("extent_t3_outer");
            break;
        }
      }
      var layersToRemove = this.getLayers();
      layersToRemove.forEach(layerToRemove => {
        var layerToAddKey = layersToAdd.findIndex(
          l => l === layerToRemove.options.name
        );
        if (layerToAddKey > -1) {
          layersToAdd.splice(layerToAddKey, 1);
        } else {
          this.removeLayer(layerToRemove.options.name)
        }
      });
      layersToAdd.forEach(layer => this.addLayer(layer));
    }
  },
  components: {
    BigNum
  }
};
</script>

<style>
.mapbox-outer-wrap {
  position: relative;
  height: 100%;
}
.mapbox-inner-wrap {
  height: calc(100vh - 56px);
  position: fixed;
  top: 56px;
  right: 0;
  padding: 0;
  z-index: 1;
}
#mapbox {
  height: 100%;
  width: 100%;
}
#map-key {
  background: white;
  padding: 5px;
  font-size: 13px;
  position: fixed;
  top: 80px;
  right: 20px;
  width: 190px;
  z-index: 2;
  text-align: left;
}
#cityData {
  background: white;
  margin-right: -30px;
  z-index: 3;
  margin-top: 100vh;
}
@media (min-width: 992px) {
  #cityData {
    margin-top: 56px;
  }
}

/*
.map-key-year {
  position: relative;
  text-indent: 15px;
  display: block;
  cursor: pointer;
  user-select: none;
  cursor: pointer;
}
.map-key-year input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.map-key-year .checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #f5f5f5;
}
*/
</style>
