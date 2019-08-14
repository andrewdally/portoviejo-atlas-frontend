<template :city='city'>
  <div>
    <div class="row">
      <div class="col-lg-6 order-last mapbox-outer-wrap">
        <div id='map-key' class="border shadow-sm">
          <div class='map-key-years btn-group d-flex'>
            <label class='btn btn-sm btn-secondary'
              :class='activeClass(year)'
              :key='"comp_" + year'
              v-for='year in years'
            >
              <input type="radio" v-model='selectYear' v-bind:value='year' v-bind:id='year + "_check"'> {{year}}
            </label>
          </div>
          <ul class="list-unstyled">
            <li class='row mb-1' v-for='item in legend'>
              <div class="col-2">
                <span class='legend-item' v-bind:style='{ backgroundColor: item.color }' />
              </div>
              <div class='col-10'>
                {{item.name}}
              </div>
            </li>
          </ul>
        </div>
        <div class="col-lg-6 mapbox-inner-wrap">
          <div id="mapbox"></div>
        </div>
      </div>
      <div id="cityData" class="col-lg-6 order-first">
        <h1 class="mt-5 mb-2">Proyecciones</h1>
        <div class="row pb-4 pt-4 border-top border-bottom">
          <div class="col-12">
            <p>
              A partir de las tendencias del crecimiento de población desarrolladas por el INE se construyeron tres escenarios para determinar el posible crecimiento tanto del área construida como de la Huella Urbana de Portoviejo.
            </p>
            <p>
              Cada uno de los escenarios, tienen en cuenta tres variables: (i) la sensibilidad a la construcción observada en la ciudad, (ii) las áreas de reserva y (iii) la tendencia de cambio en la densidad.
            </p>
            <p>
              Para este estudio se utilizaron tres tendencias de cambio de densidad, por lo cual  se obtienen tres escenarios de crecimiento urbano diferentes. La primera tendencia refleja el crecimiento urbano esperado con una densidad constante.  La segunda tendencia refleja el crecimiento urbano esperado con la tasa de cambio promedio de densidad registrada históricamente en la ciudad de Portoviejo. La tercera tendencia refleja el crecimiento urbano esperado con la tasa de el cambio promedio de la densidad registrada a nivel mundial.
            </p>
          </div>
        </div>
        <div class="row pb-2 pt-4 border-bottom">
          <div class="col-12">
            <h3>Proyecciones de área construida en 2050</h3>
          </div>
        </div>
        <div class="row pb-3 pt-3 mb-4 border-bottom">
          <div class="col-6">
            <big-num heading='Densidad constante' number='5.991' units='Hectáreas' color='blue'/>
          </div>
          <div class="col-6">
            <big-num heading='Ciudad promedio' number='9.572' units='hectáreas' color='green'/>
          </div>
          <div class="col-12">
            <big-num heading='Promedio de los paises menos desarrollados' number='10.201' units='Hectáreas' color='red'/>
          </div>
        </div>
        <div class="row border-bottom pb-5 mb-2">
          <div class="col-12">
            <canvas id='built_up_area_forecast_line' class='city-graphic' />
          </div>
        </div>
        <div class="row pb-2 pt-4 border-bottom">
          <div class="col-12">
            <h3>Proyecciones de la huella urbana en 2050</h3>
          </div>
        </div>
        <div class="row pb-3 pt-3 mb-4 border-bottom">
          <div class="col-6">
            <big-num heading='Densidad constante' number='8.558' units='Hectáreas' color='blue'/>
          </div>
          <div class="col-6">
            <big-num heading='Ciudad promedio' number='13.674' units='hectáreas' color='green'/>
          </div>
          <div class="col-12">
            <big-num heading='Promedio de los paises menos desarrollados' number='14.573' units='Hectáreas' color='red'/>
          </div>
        </div>
        <div class="row border-bottom pb-5 mb-5">
          <div class="col-12">
            <canvas id='urban_extent_forecast_line' class='city-graphic' />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {drawForecasts} from '../../assets/graphing.js'
  import BigNum from './BigNum'

  export default {
    name: 'Forecasts',
    data () {
      return {
        chartObjects: {},
        laterYear: true,
        city: window.city,
        host: '{s}.atlasofurbanexpansion.org',
        years: [
          'Área Construida',
          'Huella Urbana'
        ],
        selectYear: 'Área Construida',
        activeLayers: [
          'forecasts_??'
        ],
        allLayers: {},
        layers: [
          {on: true, name: 'forecasts_??', url: '/forecasts/forecasts_??/'}
        ],
        legend: [
          {name: 'Huella Urbana 2017', color: '#da8b40'},
          {name: 'Densidad constante', color: 'blue'},
          {name: 'Tendencia Ciudad', color: 'green'},
          {name: 'Tendencia Mundo', color: 'red'}
        ]
      }
    },
    mounted () {
      this.launchGraphs()
      this.map = L.mapbox.map("mapbox", null, {
        center: [this.city.City.latitude, this.city.City.longitude],
        reuseTiles: true,
        zoom: 12,
        zoomControl: false,
        scrollWheelZoom: false,
        tap: false
      });

      new L.Control.Zoom({ position: "topleft" }).addTo(this.map);

      this.lightBG = L.mapbox
        .styleLayer("mapbox://styles/willcmccusker/cj44oki3u843e2rnx1wyilp8z")
        .addTo(this.map);
      this.setLayers();
      this.loadMapLayers();

    },
    destroyed () {
      this.destroyGraphs()
    },
    watch: {
      selectYear: function() {
        this.loadMapLayers()
      }
    },
    methods: {
      destroyGraphs () {
        for (var key in this.chartObjects) {
          if (this.chartObjects.hasOwnProperty(key)) {
            this.chartObjects[key].destroy()
          }
        }
      },
      activeClass(year) {
        return year === this.selectYear ? 'active' : 'disabled';
      },
      launchGraphs () {

        let chart = {}

        let id = 'built_up_area_forecast_line'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = drawForecasts(id, this.city)

        id = 'urban_extent_forecast_line'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = drawForecasts(id, this.city)

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
          // maxZoom: 13
        };

        var yearCount = 2
        options.opacity = .7
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
  }

</script>
