<template>
  <div>
    <div class="row">
      <div class="col-lg-6 order-last mapbox-outer-wrap">
        <div id='map-key' class="border shadow-md">
          <div class='map-key-years btn-group d-flex'>
            <label class='btn btn-sm btn-secondary'
              :class='[activeClass(year), btnClass(year)]'
              :key='"comp_" + year'
              v-for='year in years'
            >
              <input type="radio" v-model='selectYear' v-bind:value='year' v-bind:id='year + "_check"'> {{year}}
            </label>
          </div>
        </div>
        <div class="col-lg-6 mapbox-inner-wrap">
          <div id="mapbox"></div>
        </div>
      </div>
      <div id="cityData" class="col-lg-6 order-first">
        <h1 class="mt-5 mb-2">Vias</h1>
        <div class="row pb-2 pt-4 mb-4 border-top border-bottom">
          <div class="col-12">
            <h3>Ancho Promedio de las vías (Metros)</h3>
          </div>
        </div>
        <div class="row pb-4 mb-4 border-bottom">
          <div class="col-4 pt-2">
            <big-num heading='Pre 1990' number='10.4' units='Metros' color='#ac2341'/>
          </div>
          <div class="col-4 pt-2">
            <big-num heading='1990–2015' number='8.74' units='Metros' color='#da8b40'/>
          </div>
        </div>
        <div class="row pt-2 pb-3 mb-4 border-bottom">
          <div class="col-12">
            <p>
              El ancho promedio de las vías en el área de expansión de Portoviejo durante 1990-2015 es de 8.74 metros, frente a 10.4 metros en el área urbana anterior a 1990.
            </p>
          </div>
        </div>
        <div class="row border-bottom pb-4 mb-4">
          <div class="col-12">
            <canvas id='roads_average_width_bar' class='city-graphic' />
          </div>
        </div>
        <div class="row pb-2 mb-4 border-bottom">
          <div class="col-12">
            <h3>Porcentaje de área edificada ocupado por vías</h3>
          </div>
        </div>
        <div class="row pb-4 mb-4 border-bottom">
          <div class="col-4 pt-2">
            <big-num heading='Pre 1990' number='26%' color='#ac2341'/>
          </div>
          <div class="col-4 pt-2">
            <big-num heading='1990–2015' number='27%' color='#da8b40'/>
          </div>
        </div>
        <div class="row pt-2 pb-3 mb-4 border-bottom">
          <div class="col-12">
            <p>
              La proporción del área edificada en Portoviejo ocupada por vías en el área de expansión 1990-2015 es de 27%, frente a 26% en el área área urbana anterior a 1990.
            </p>
          </div>
        </div>
        <div class="row border-bottom pb-4 mb-4">
          <div class="col-12">
            <canvas id='roads_in_built_up_area_bar' class='city-graphic' />
          </div>
        </div>
        <div class="row border-bottom pb-4 mb-4">
          <div class="col-12">
            <h3>Composición del Ancho de las Vías</h3>
          </div>
        </div>
        <div class="row pb-4 mb-4 border-bottom">
          <div class="col-12">
            <canvas id='roads_width_stacked_bar' class='city-graphic' />
          </div>
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
  name: "Roads",
  //props: ['section', 'city'],
  data() {
    return {
      extraLayersVisible: false,
      city: window.city,
      chartObjects: {},
      laterYear: true,
      host: '{s}.atlasofurbanexpansion.org',
      years: [
        'Pre 1990',
        '1990-2015'
      ],
      selectYear: '1990-2015',
      activeLayers: ['roads_??'],
      allLayers: {},
      layers: [
        {on: true, name: 'roads_??', url: '/roads/roads_??/'}
      ]
    };
  },
  computed: {
    layersFiltered() {
      return this.layers.filter(l => l.color);
    },
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
    this.satBG = L.mapbox
      .styleLayer('mapbox://styles/willcmccusker/cj1s0rv49000w2sqm46rsl141')
        .addTo(this.map)
    // this.labelsMap = L.mapbox
    //   .styleLayer("mapbox://styles/willcmccusker/cj1s19z2u000l2snsh0t9i8gw")
    //   .addTo(this.map);
    this.setLayers();
    this.loadMapLayers();

  },
  destroyed() {
    this.destroyGraphs();
  },
  watch: {
    selectYear: function() {
      this.loadMapLayers()
    },
  },
  methods: {
    btnClass(year) {
      var lastYear = year.split('–')[1]
      return 'btn-' + lastYear
    },
    activeClass(year) {
      return year === this.selectYear ? 'active' : 'disabled';
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
    launchGraphs() {
      let chart = {};

      var id = 'roads_in_built_up_area_bar'
      if (this.chartObjects[id]) this.chartObjects[id].destroy()
      chart[id] = makeChart(id, this.city, '% del Área Urbana ocupado por vías y bulevares', '%', 100, true)
      id = 'roads_average_width_bar'
      if (this.chartObjects[id]) this.chartObjects[id].destroy()
      chart[id] = makeChart(id, this.city, 'Ancho Promedio de las vías (Metros)', 'm', undefined, true)
      id = 'roads_width_stacked_bar'
      if (this.chartObjects[id]) this.chartObjects[id].destroy()
      chart[id] = makeStacked(id, this.city, 'Composición del Ancho de las Vías', undefined, undefined, true)
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
      };

      var yearCount = 2
      options.opacity = 0.7
      options.maxZoom = 17
      this.addYearLayers(yearCount, options)
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
      var inc = 1;
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
      var timePeriod = "t" + (this.years.indexOf(this.selectYear));
      var timePeriod_ = "t" + (this.years.indexOf(this.selectYear) + 1);
      var layersToAdd = [];

      this.layers.forEach(layer => {
        if (layer.on) {
          layersToAdd.push(
            layer.name.replace("??", timePeriod).replace("!!", timePeriod_)
          );
        }
      });

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
