<template>
  <div>
    <div class="row">
      <div class="col-lg-6 order-last mapbox-outer-wrap">
        <div id='map-key' class="border shadow-sm">
          <div class='map-key-years'>
            <div class='map-key-years btn-group d-flex'>
              <label class='btn btn-sm btn-secondary'
                :class='[activeClass(year), btnClass(year)]'
                :key='"comp_" + year'
                v-for='year in years'
              >
                <input class="checkbox" type="checkbox" v-model='extentYears' v-bind:value='year' v-bind:id='year + "_check"' > {{year}}
              </label>
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
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num heading='1985' :number='city.DataSet.urban_extent_actuals_t1' units='Hectáreas' color='#2e2e76'/>
          </div>
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num heading='1998' :number='city.DataSet.urban_extent_actuals_t2' units='Hectáreas' color='#ac2341'/>
          </div>
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num class='mb-3' heading='2007' :number='city.DataSet.urban_extent_actuals_t2b' units="Hectáreas" color='#2FA3EB'/>
          </div>
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num heading='2017' :number='city.DataSet.urban_extent_actuals_t3' units='Hectáreas' color='#da8b40'/>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-lg-12">
            <p>
              La huella urbana de Portoviejo en 2017 fue de {{city.DataSet.urban_extent_actuals_t3}} hectáreas, aumentando a una tasa promedio anual de {{urban_extent_change_t2_t3_percent}} desde 1998.
              La huella urbana en 1.998 fue de {{city.DataSet.urban_extent_actuals_t2}} hectáreas, aumentando a una tasa promedio anual de {{urban_extent_change_t1_t2_percent}} desde 1985, cuando su huella urbana era  de {{city.DataSet.urban_extent_actuals_t1}} hectáreas
            </p>
          </div>
          <div class="col-md-6 col-lg-12">
            <p>
              La huella urbana es la combinación del área edificada con  el espacio abierto asociado con la ciudad en una fecha determinada. La huella urbana se deriva aplicando una "regla de inclusión" a los conglomerados urbanos en toda el área de estudio.
            </p>
          </div>
        </div>
        <div class="row pt-4 mb-4 border-top border-bottom">
          <div class="col-12">
            <h3 class="mb-4">Cambio Porcentual</h3>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class="col-4">
            <big-num heading='Pre 1990' :number='urban_extent_change_t1_t2_percent' color='#FF6A4D'/>
          </div>
          <div class="col-4">
            <big-num heading='1990-2015' :number='urban_extent_change_t2_t3_percent' color='#97928C'/>
          </div>
        </div>
        <div class="row border-bottom pb-4 mb-4">
          <div class="col-12">
            <canvas id='urban_extent_change_bar' class='city-graphic' />
          </div>
        </div>
        <div class="row border-bottom">
          <div class="col-12">
            <h3 class="mb-4">Población</h3>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num class='mb-3' heading='1985' :number='city.DataSet.population_t1' color='#2e2e76'/>
          </div>
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num class='mb-3' heading='1998' :number='city.DataSet.population_t2' color='#ac2341'/>
          </div>
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num class='mb-3' heading='2007' :number='city.DataSet.population_t2b' color='#2FA3EB'/>
          </div>
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num heading='2017' :number='city.DataSet.population_t3' color='#da8b40'/>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-12'>
            <canvas id='population_line' class='city-chart'/>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-12'>
            <p>
              La población de Portoviejo en 2018 era de {{city.DataSet.population_t3}} personas, aumentando a una tasa anual promedio de {{population_change_t2_t3_percent}} desde 2000.
            </p>
          </div>
        </div>
        <div class="row border-bottom">
          <div class='col-12'>
            <h3 class='mb-4'>Cambio Porcentual</h3>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-6'>
            <big-num class='mb-3' heading='Pre 1990' :number='population_change_t1_t2_percent' color='#FF6A4D'/>
          </div>
          <div class='col-6'>
            <big-num heading='1990-2015' :number='population_change_t2_t3_percent' color='#97928C'/>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-12'>
            <canvas id='population_change_bar' class='city-chart'/>
          </div>
        </div>
        <div class="row border-bottom">
          <div class="col-12">
            <h3 class="mb-4">Densidad del Área Edificada</h3>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num class='mb-3' heading='1985' :number='city.DataSet.density_built_up_t1' units='Personas/Hectáreas' color='#2e2e76'/>
          </div>
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num class='mb-3' heading='1998' :number='city.DataSet.density_built_up_t2' units='Personas/Hectáreas' color='#ac2341'/>
          </div>
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num class='mb-3' heading='2007' :number='city.DataSet.density_built_up_t2b' units='Personas/Hectáreas' color='#2FA3EB'/>
          </div>
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num heading='2017' :number='city.DataSet.density_built_up_t3' units='Personas/Hectáreas' color='#da8b40'/>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-12'>
            <canvas id='density_built_up_line' class='city-chart'/>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-12'>
            <p>
              La densidad del área edificada en Portoviejo en 2017 fue de {{city.DataSet.density_built_up_t3}} personas por hectárea, disminuyendo a una tasa promedio anual de {{density_built_up_change_t2_t3_percent}} desde 1998.
              La densidad del área edificada en 1998 fue de {{city.DataSet.density_built_up_t2}} personas por hectárea, disminuyendo a una tasa promedio anual de {{density_built_up_change_t1_t2_percent}} desde 1985 cuando la densidad del área construida era de {{city.DataSet.density_built_up_t1}} personas por hectárea.
            </p>
          </div>
        </div>
        <div class="row border-bottom">
          <div class='col-12'>
            <h3 class='mb-4'>Cambio Porcentual</h3>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-6'>
            <big-num class='mb-3' heading='Pre 1990' :number='density_built_up_change_t1_t2_percent' color='#FF6A4D'/>
          </div>
          <div class='col-6'>
            <big-num heading='1990-2015' :number='density_built_up_change_t2_t3_percent' color='#97928C'/>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-12'>
            <canvas id='density_built_up_change_bar' class='city-chart'/>
          </div>
        </div>
        <div class="row border-bottom">
          <div class="col-12">
            <h3 class="mb-4">Densidad de la Huella Urbana</h3>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num class='mb-3' heading='1985' :number='city.DataSet.density_urban_extent_t1' units='Personas/Hectáreas' color='#2e2e76'/>
          </div>
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num class='mb-3' heading='1998' :number='city.DataSet.density_urban_extent_t2' units='Personas/Hectáreas' color='#ac2341'/>
          </div>
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num class='mb-3' heading='2007' :number='city.DataSet.density_urban_extent_t2b' units='Personas/Hectáreas' color='#2FA3EB'/>
          </div>
          <div class='col-lg-6 col-md-3 col-sm-6'>
            <big-num heading='2017' :number='city.DataSet.density_urban_extent_t3' units='Personas/Hectáreas' color='#da8b40'/>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-12'>
            <canvas id='density_urban_extent_line' class='city-chart'/>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-12'>
            <p>
              La densidad de la huella urbana en Portoviejo en 2.017 fue de {{city.DataSet.density_urban_extent_t3}} personas por hectárea, disminuyendo a una tasa promedio anual de {{density_urban_extent_change_t2_t3_percent}} desde 1.998.
              La densidad de la huella urbana en 1.998 fue de {{city.DataSet.density_urban_extent_t2}} personas por hectárea, disminuyendo a una tasa promedio anual de {{density_urban_extent_change_t1_t2_percent}} desde 1.985 cuando la densidad de la huella urbana era de {{city.DataSet.density_urban_extent_t1}} personas por hectárea.
            </p>
          </div>
        </div>
        <div class="row border-bottom">
          <div class='col-12'>
            <h3 class='mb-4'>Cambio Porcentual</h3>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-6'>
            <big-num class='mb-3' heading='Pre 1990' :number='density_urban_extent_change_t1_t2_percent' color='#FF6A4D'/>
          </div>
          <div class='col-6'>
            <big-num heading='1990-2015' :number='density_urban_extent_change_t2_t3_percent' color='#97928C'/>
          </div>
        </div>
        <div class="row pb-4 pt-4 mb-4 border-bottom">
          <div class='col-12'>
            <canvas id='density_urban_extent_change_bar' class='city-chart'/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { makeChart, makeStacked, makeLine } from '../../assets/graphing.js'
import BigNum from './BigNum'
import {cities} from '../../assets/json/master'

export default {
  name: "UrbanExtentPopulation",
  data() {
    return {
      city: cities[this.$route.params.city_slug],
      chartObjects: {},
      laterYear: true,
      host: '{s}.atlasofurbanexpansion.org',
      allLayers: {},
      layers: []
    };
  },
  computed: {
    years () {
      return [
        this.city.City.t1.substr(0, 4),
        this.city.City.t2.substr(0, 4),
        this.city.City.t2b.substr(0, 4),
        this.city.City.t3.substr(0, 4)
      ]
    },
    extentYears () {
      return [
        this.city.City.t1.substr(0, 4),
        this.city.City.t2.substr(0, 4),
        this.city.City.t2b.substr(0, 4),
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
          display: this.city.City.t2b.substr(0, 4),
          checked: this.years[1].checked
        },
        {
          display: this.city.City.t3.substr(0, 4),
          checked: this.years[2].checked
        }
      ];
    },
    urban_extent_change_t1_t2_percent() {
      return this.city.DataSet.urban_extent_change_t1_t2 + '%'
    },
    urban_extent_change_t2_t3_percent() {
      return this.city.DataSet.urban_extent_change_t2_t3 + '%'
    },
    population_change_t1_t2_percent() {
      return this.city.DataSet.population_change_t1_t2 + '%'
    },
    population_change_t2_t3_percent() {
      return this.city.DataSet.population_change_t2_t3 + '%'
    },
    density_built_up_change_t1_t2_percent() {
      return this.city.DataSet.density_built_up_change_t1_t2 + '%'
    },
    density_built_up_change_t2_t3_percent() {
      return this.city.DataSet.density_built_up_change_t2_t3 + '%'
    },
    density_urban_extent_change_t1_t2_percent() {
      return this.city.DataSet.density_urban_extent_change_t1_t2 + '%'
    },
    density_urban_extent_change_t2_t3_percent() {
      return this.city.DataSet.density_urban_extent_change_t2_t3 + '%'
    }
  },
  mounted() {
    this.launchGraphs();
    this.map = L.mapbox.map("mapbox", null, {
      center: [this.city.City.latitude, this.city.City.longitude],
      reuseTiles: true,
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: false,
      scrollZoom: false
    });

    new L.Control.Zoom({ position: "bottomright" }).addTo(this.map);

    this.lightBG = L.mapbox
      .styleLayer("mapbox://styles/willcmccusker/cj44oki3u843e2rnx1wyilp8z")
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
      return this.extentYears.includes(year) ? 'active' : 'disabled';
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
      var id = "urban_extent_change_bar";
      if (this.chartObjects[id]) this.chartObjects[id].destroy();
      chart[id] = makeChart(id, this.city, "Huella Urbana Urban Extent Avg. Annual % Change");

      id = 'population_line'
      if (this.chartObjects[id]) this.chartObjects[id].destroy()
      chart[id] = makeLine(id, this.city, 'Population')

      id = 'population_change_bar'
      if (this.chartObjects[id]) this.chartObjects[id].destroy()
      chart[id] = makeChart(id, this.city, 'Population Avg. Annual % Change', '%')

      id = 'density_built_up_line'
      if (this.chartObjects[id]) this.chartObjects[id].destroy()
      chart[id] = makeLine(id, this.city, 'Built-up Area Density (Persons/Hectare)', ' Personas/Hectárea')

      id = 'density_built_up_change_bar'
      if (this.chartObjects[id]) this.chartObjects[id].destroy()
      chart[id] = makeChart(id, this.city, 'Built-up Area Avg. Annual % Change')

      id = 'density_urban_extent_line'
      if (this.chartObjects[id]) this.chartObjects[id].destroy()
      chart[id] = makeLine(id, this.city, 'Urban Extent Density (Persons/Hectare)', ' Personas/Hectárea')

      id = 'density_urban_extent_change_bar'
      if (this.chartObjects[id]) this.chartObjects[id].destroy()
      chart[id] = makeChart(id, this.city, 'Urban Extent Avg. Annual % Change')


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
      for (var t = 1; t < 5; t++) {
        for (var sec = 1; sec <= t; sec++) {
          var name  = "t" + t + "_t" + sec;
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
      console.log(this.allLayers)
      options.opacity = 1;
      this.addYearLayers(4, options);
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
      console.log(this.layers)
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
          console.log('layer', layer);
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
      var layersToAdd = []
      if (this.extentYears.includes(this.years[3])) {
        layersToAdd = ["extent_t4_t1", "extent_t4_t2", "extent_t4_t3", "extent_t4_t4"]
      }
      if (this.extentYears.includes(this.years[2])) {
        layersToAdd[2] = "extent_t3_t3"
        layersToAdd[1] = "extent_t3_t2"
        layersToAdd[0] = "extent_t3_t1"
      }
      if (this.extentYears.includes(this.years[1])) {
        layersToAdd[1] = "extent_t2_t2"
        layersToAdd[0] = "extent_t2_t1"
      }
      if (this.extentYears.includes(this.years[0])) {
        layersToAdd[0] = "extent_t1_t1"
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
