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
        </div>
        <div class="col-lg-6 mapbox-inner-wrap">
          <div id="mapbox"></div>
        </div>
      </div>
      <div id="cityData" class="col-lg-6 order-first">
        <h1 class="mt-5 mb-2">Vías Arteriales</h1>
        <div class="row pb-4 pt-4 mb-4 border-top border-bottom">
          <div class="col-12">
            <h3>Densidad de Vías Arteriales</h3>
          </div>
        </div>
        <div class="row border-bottom pb-4">
          <div class="col-4">
            <big-num heading='Pre 1990' number='3.76' units='km/km²' color='#ac2341'/>
          </div>
          <div class="col-4">
            <big-num heading='1990-2017' number='2.39' units='km/km²' color='#da8b40'/>
          </div>
        </div>
        <div class="row border-bottom pt-4 mt-4 pb-5 mb-5">
          <div class="col-12">
            <h5 class='text-center'>Densidad de Vías Arteriales ({{selectYear}})</h5>
            <canvas id='arterial_roads_density_bar' class='city-graphic' />
          </div>
        </div>
        <div class="row border-bottom mb-5">
          <div class="col-12 pb-4">
            <h3>Porcentaje de Área Edificada a Distancia Caminable de una Vía Arterial</h3>
          </div>
        </div>
        <div class="row border-bottom pb-4">
          <div class="col-4">
            <big-num heading='Pre 1990' number='99.6%' color='#ac2341'/>
          </div>
          <div class="col-4">
            <big-num heading='1990-2015' number='99.14' color='#da8b40'/>
          </div>
        </div>
        <div class="row border-bottom pt-4 mt-4 pb-5 mb-5">
          <div class="col-12">
            <h5 class='text-center'>Porcentaje de Área Edificada a Distancia Caminable ({{selectYear}})</h5>
            <canvas id='arterial_roads_walking_bar' class='city-graphic' />
          </div>
        </div>
        <div class="row border-bottom pb-2 mb-5">
          <div class="col-12 pb-4">
            <h3>Distancia en Linea Recta a Vías Arterial</h3>
          </div>
        </div>
        <div class="row border-bottom pb-5 mb-5">
          <div class="col-12">
            <h5 class='text-center'>Distancia en Linea Recta ({{selectYear}})</h5>
            <canvas id='arterial_roads_beeline_bar' class='city-graphic' />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BigNum from './BigNum'
  import {returnRoadChartData, makeRoadChart} from '../../assets/graphing.js'
  export default {
    name: 'Arterials',
    data () {
      return {
        chartObjects: {},
        city: window.city,
        host: '{s}.atlasofurbanexpansion.org',
        years: [
          'Pre 1990',
          '1990–2015'
        ],
        selectYear: '1990–2015',
        activeLayers: [
          'arterials_??'
        ],
        allLayers: {},
        layers: [
          {on: true, name: 'arterials_??', url: '/arterials/arterials_??/'}
        ]
      }
    },
    computed: {
      earlyRange () {
       return this.city.City.t1.substr(0, 4) + '—' + this.city.City.t2.substr(0, 4)
      },
      laterRange () {
       return this.city.City.t2.substr(0, 4) + '—' + this.city.City.t3.substr(0, 4)
      }
    },
    mounted () {
      this.launchGraphs()
      this.map = L.mapbox.map("mapbox", null, {
        center: [this.city.City.latitude, this.city.City.longitude],
        reuseTiles: true,
        zoom: 12,
        zoomControl: false,
        scrollWheelZoom: false
      });

      new L.Control.Zoom({ position: "bottomright" }).addTo(this.map);

      this.lightBG = L.mapbox
        .styleLayer("mapbox://styles/willcmccusker/cj44oki3u843e2rnx1wyilp8z")
        .addTo(this.map);
      // this.labelsMap = L.mapbox
      //   .styleLayer("mapbox://styles/willcmccusker/cj1s19z2u000l2snsh0t9i8gw")
      //   .addTo(this.map);
      this.setLayers();
      this.loadMapLayers();


    },
    watch: {
      selectYear () {
        this.toggleGraphs()
      }
    },
    computed: {
      laterYear() {
        return this.selectYear === this.years[1]
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
      launchGraphs () {
        let chart = {}
        let id = 'arterial_roads_density_bar'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = makeRoadChart(id, this.city, 'Density of Arterial Roads (km/km²)', ' km/km²', undefined, this.laterYear)
        id = 'arterial_roads_walking_bar'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = makeRoadChart(id, this.city, 'Share of Area Within Walking Distance of Arterial Roads', '%', 100, this.laterYear)
        id = 'arterial_roads_beeline_bar'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = makeRoadChart(id, this.city, 'Beeline Distance to Arterial Roads', 'm', undefined, this.laterYear)
        this.chartObjects = Object.assign({}, this.chartObjects, chart)
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
      },
      toggleGraphs() {
        var roads = ['arterial_roads_density_bar', 'arterial_roads_walking_bar', 'arterial_roads_beeline_bar']
        roads.forEach((road) => {
          var meta = returnRoadChartData(road, this.city, this.laterYear)
          meta.datasets.forEach((dataset, i) => {
            var data = Object.assign({}, dataset.data)
            Object.assign(this.chartObjects[road].config.data.datasets[i].data, data)
          })
          this.chartObjects[road].update()
        })
      }
    },
    components: {
      BigNum
    }
  }

</script>
