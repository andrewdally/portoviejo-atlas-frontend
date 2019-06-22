<template>
  <div>
    <div class="row">
      <div class="col-lg-6 order-last mapbox-outer-wrap">
        <div id='map-key' class="border shadow-sm">
          <div class='map-key-years btn-group d-flex'>
            <label class='btn btn-sm btn-secondary'
              :class='[activeClass(year), btnClass(year)]'
              :key='"comp_" + year'
              v-for='year in years'
            >
              <input type="radio" v-model='compositionYear' v-bind:value='year' v-bind:id='year + "_check"'> {{year}}
            </label>
          </div>
          <div class='map-key-layers '>
            <div class='row' v-for='layer in layers'>
              <div class="col-2">
                <span class='legend-item' v-bind:style='{ backgroundColor: layer.color }' />
              </div>
              <div class='col-10'>
                {{layer.display}}
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6 mapbox-inner-wrap">
          <div id="mapbox"></div>
        </div>
      </div>
      <div id="cityData" class="col-lg-6 order-first">
        <h1 class="mt-5 mb-2">Composición Urbana</h1>
        <div class="row pb-2 pt-4 mb-4 border-top border-bottom">
          <div class="col-12">
            <p>
              El mapa describe las cuatro categorías que componen el área urbana de la ciudad de Portoviejo y cómo estas han evolucionado a lo largo de los cuatro periodos de estudio.
              <br>
              <br>
              La huella urbana se puede dividir en cuatro categorías de espacio:
              <span v-html='highlight("urbano", "#2300BD")' />,
              <span v-html='highlight("suburbano", "#C2799F")' />,
              <span v-html='highlight("rural construido", "#000")' />, and
              <span v-html='highlight("espacio abierto urbanizado", "#FFFB29", "black")' />.
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-12 mb-4 mt-4">
            <div>
              <canvas id='urban_extent_composition_stacked_bar' class='city-graphic'/>
            </div>
          </div>
        </div>
        <div class="row border-bottom border-top">
          <div class="col-12 pt-4 mb-4">
            <p>
              En cuatro tipos: urbanos, suburbanos, rurales y el espacio abierto urbanizado  — dependiendo de la proporción de píxeles construidos dentro de lo que denominamos el Círculo de Caminabilidad— definido como un círculo con un área de un km<sup>2</sup> y un radio de 584 metros, en el que todos los puntos se encuentran a una distancia alcanzable a pie en aproximadamente diez minutos — alrededor de cada uno de ellos:
            </p>
            <p>
              Los píxeles <span v-html='highlight("urbanos", "#2300BD")' /> son píxeles con la mayoría de píxeles construidos (50% o más) en su círculo de caminabilidad;
            </p>
            <p>
              Los píxeles <span v-html='highlight("suburbanos", "#C2799F")' /> son píxeles aquellos que tienen un 25-50% de píxeles construidos en su círculo de caminabilidad; y
            </p>
            <p>
              Los píxeles <span v-html='highlight("rurales", "#000")' /> son píxeles con menos del 25% de píxeles construidos en su círculo de caminabilidad.
            </p>
            <p>
              El <span v-html='highlight("espacio abierto urbanizado", "#FFFB29", "black")' /> son áreas sin edificar y zonas verdes desarrolladas que incluye:
            </p>
            <ul>
              <li>Campo abierto </li>
              <li>Bosques</li>
              <li>Campos de cultivo</li>
              <li>Parques</li>
              <li>Áreas urbanas sin edificar que no han sido subdivididas</li>
              <li>Suelo deforestado</li>
              <li>Cuerpos de agua: mares, ríos, lagos y canales</li>
            </ul>
            </p>
              El espacio abierto marginal consta de todos los píxeles de espacio abierto a menos de 100 metros de píxeles urbanos o suburbanos; y el espacio abierto capturado consta de todos los grupos de espacio abierto que están completamente rodeados por píxeles urbanos y suburbanos del área construida y los píxeles de espacio abierto que los rodean, y que tienen menos de 200 hectáreas de área.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { makeChart, makeStacked } from '../../assets/graphing.js'
import BigNum from './BigNum'
import {cities} from '../../assets/json/master'

export default {
  name: "UrbanComposition",
  data() {
    return {
      extraLayersVisible: true,
      city: cities[this.$route.params.city_slug],
      chartObjects: {},
      laterYear: true,
      host: '{s}.atlasofurbanexpansion.org',
      activeCompositionLayers: [
        "extent_??_urbanBuilt",
        "extent_??_suburbanBuilt",
        "extent_??_ruralBuilt",
        "extent_??_urbanOpen"
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
        }      ]
    };
  },
  computed: {
    compositionYear () {
      return this.city.City.t3.substr(0, 4)
    },
    years () {
      return [
        this.city.City.t1.substr(0, 4),
        this.city.City.t2.substr(0, 4),
        this.city.City.t3.substr(0, 4)
      ]
    },
    extentYears () {
      return [
        this.city.City.t1.substr(0, 4),
        this.city.City.t2.substr(0, 4),
        this.city.City.t3.substr(0, 4)
      ]
    },
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
    console.log('thiscity', this.city)
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
    btnClass(year) {
      return 'btn-' + year
    },
    activeClass(year) {
      return year === this.compositionYear ? 'active' : 'disabled';
    },
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
    highlight(text, background, color='white') {
      return(`<strong style='color: ${color}; padding: 0 5px; background-color: ${background};'><em>${text}</em></strong>`)
    },
    launchGraphs() {
      let chart = {};

      let id = "urban_extent_composition_stacked_bar";
      if (this.chartObjects[id]) this.chartObjects[id].destroy();
      chart[id] = makeStacked(id, this.city, "Urban Composition");

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
