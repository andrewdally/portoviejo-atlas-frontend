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
              <input type="radio" v-model='selectYear' v-bind:value='year' v-bind:id='year + "_check"'> {{year}}
            </label>
          </div>
          <div class='map-key-layers '>
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
        <h1 class="mt-5 mb-2">Composición del Área Agregada</h1>
        <div class="row pb-4 pt-4 mb-4 border-top border-bottom">
          <div class="col-4">
            <big-num heading='1985-1998' number='737' units='Hectáreas' color='#ac2341'/>
          </div>
          <div class="col-4 text-left">
            <big-num heading='1998-2017' number='1,739' units='Hectáreas' color='#da8b40'/>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <p>
              Un total de 1.739 hectáreas de área edificada se agregó a la extensión urbana de Portoviejo entre 1998 y 2017. De esa área edificada agregada, 38% fue relleno, 45% fue extensión, 2% fue crecimiento discontinuo y 16% fue inclusión.
              Un total de 737 hectáreas de área edificada se agregó a la extensión urbana de Portoviejo en el período anterior, entre 1985 y 1998. De esa área construida adicional, 32% fue relleno, 47% fue extensión, 2% fue crecimiento discontinuo y el 18% fue inclusión.
            </p>
            <p>
              <span v-html='highlight("Relleno", "#ff01c4")' /> consiste en todos los píxeles agregados en el nuevo periodo que ocupan Espacio Abierto Urbanizado en la Huella Urbana del periodo inmediatamente anterior;
            </p>
            <p>
              <span v-html='highlight("Extensión", "#ff9b10")' /> consiste en todos los píxeles construidos agregados en el nuevo periodo que son contiguos a la Huella Urbana del periodo anterior.
            </p>
            <p>
              <span v-html='highlight("Crecimiento", "#fe0000")' /> discontinuo consiste en todos los píxeles construidos agregados en el nuevo periodo que constituyen nuevos Clústeres Urbanos contiguos que no son adyacentes a la Huella Urbana de del periodo anterior o a nuevos clústeres, y;
            </p>
            <p>
              <span v-html='highlight("Inclusión", "#358866")' /> consiste en todos los píxeles construidos sea urbanos, rurales o suburbanos que estaban afuera de la Huella Urbana del periodo anterior y que ahora están en la Huella Urbana del nuevo periodo.
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

export default {
  name: "AddedArea",
  data() {
    return {
      city: window.city,
      chartObjects: {},
      laterYear: true,
      host: '{s}.atlasofurbanexpansion.org',
      years: [
        '1985–1998',
        '1998–2017'
      ],
      selectYear: '1998–2017',
      activeLayers: [
        "addedArea_??_builtUp",
        "addedArea_??_infill",
        "addedArea_??_extension",
        "addedArea_??_leapfrog",
        "addedArea_??_inclusion"
      ],
      allLayers: {},
      layers: [
        {on: true, display: 'Área Construida', name: 'addedArea_??_builtUp', url: '/added_area/built_up_area_??/', color: 'rgba(52,22,186,0.5)'},
        {on: true, display: 'Relleno', name: 'addedArea_??_infill', url: '/added_area/infill_??_!!/', color: 'rgba(255,1,196,0.5)'},
        {on: true, display: 'Extensión', name: 'addedArea_??_extension', url: '/added_area/extension_??_!!/', color: 'rgba(255,255,16,0.5)'},
        {on: true, display: 'Crecimiento Discontinuo', name: 'addedArea_??_leapfrog', url: '/added_area/leapfrog_??_!!/', color: 'rgba(254,0,0,0.5)'},
        {on: true, display: 'Inclusión', name: 'addedArea_??_inclusion', url: '/added_area/inclusion_??_!!/', color: 'rgba(53,136,102,0.5)'}
      ]
    };
  },
  computed: {
    layersFiltered() {
      return this.layers.filter(l => l.color);
    },
  },
  mounted() {
    this.map = L.mapbox.map("mapbox", null, {
      center: [this.city.City.latitude, this.city.City.longitude],
      reuseTiles: true,
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: false
    });

    // this.map.dragging.disable();
    // this.map.on('click', function() {
    //   this.map.dragging.enable();
    // });

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
    selectYear: function() {
      this.loadMapLayers()
    }
  },
  methods: {
    btnClass(year) {
      var lastYear = year.split('–')[1]
      return 'btn-' + lastYear
    },
    activeClass(year) {
      return year === this.selectYear ? 'active' : 'disabled';
    },
    highlight(text, background, color='white') {
      return(`<strong style='color: ${color}; padding: 0 5px; background-color: ${background};'><em>${text}</em></strong>`)
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

      var yearCount = 2
      options.opacity = 1
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
      var timePeriod = "t" + (this.years.indexOf(this.selectYear) + 1);
      var timePeriod_ = "t" + (this.years.indexOf(this.selectYear) + 2);
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
