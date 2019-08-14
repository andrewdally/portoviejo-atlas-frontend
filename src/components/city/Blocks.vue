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
          <ul class="list-unstyled map-key-layers">
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
        <h1 class="mt-5 pb-4 mb-2">Manzanas y Lotes</h1>
        <div class="row pb-2 pt-4 mb-4 border-top border-bottom">
          <div class="col-12 mb-2">
            <h3>Tamaño de Manzana</h3>
          </div>
        </div>
        <div class="row border-bottom pb-4 mb-4">
          <div class="col-4">
            <big-num heading='Pre 1990' number='2' units='Hectáreas' color='#ac2341'/>
          </div>
          <div class="col-4 text-left">
            <big-num heading='1990-2015' number='5' units='Hectáreas' color='#da8b40'/>
          </div>
        </div>
        <div class="row border-bottom mb-4 pt-2 pb-3">
          <div class="col-12">
            <p>
              El tamaño promedio de las manzanas en el área de expansión de Portoviejo entre 1990 y 2015 era de 5 hectáreas, frente a 2 hectáreas en su área anterior a 1990.
            </p>
          </div>
        </div>
        <div class="row pt-4 pb-4 mb-4 border-bottom">
          <div class="col-lg-12">
            <canvas id='blocks_plots_average_block_bar' />
          </div>
        </div>
        <div class="row border-bottom pb-4 mb-4">
          <div class="col-lg-12">
            <h3>Porcentaje de Asentamientos en uso Residencial</h3>
          </div>
        </div>
        <div class="row pt-4 pb-4 mb-4 border-bottom">
          <div class="col-lg-12">
            <p>
              La categoría residencial incluye las siguientes subcategorías:
            </p>
            <p>
              <span v-html='highlight("Asentamiento atomizado", "rgb(202, 145, 121)")' /> El desarrollo atomizado es de trazado irregular y no fue subdividido antes que se efectuara el desarrollo residencial. Podría incluir asentamientos irregulares sin subdivisión, casas construidas en parcelas irregulares de tierra (por ejemplo, villas) o casas edificadas en áreas rurales que no fueron subdivididas
            </p>
            <p>
              <span v-html='highlight("Subdivisión informal", "rgb(191, 97, 77)")' />  Las subdivisiones informales son áreas que han sido subdivididas para uso urbano, pero que carecen de evidencia visible de formalidad legal, como calles pavimentadas, iluminación pública o aceras. Los tamaños de los lotes son regulares o semirregulares.
            </p>
            <p>
              <span v-html='highlight("Subdivisión formal", "rgb(164, 53, 43)")' /> Los trazados formales son similares a los informales, pero presentan un mayor nivel de infraestructura. Específicamente, todas las vías deben ser pavimentadas para que un área califique como subdivisión formal. Las aceras y las luminarias públicas son usualmente visibles. Los trazados formales se caracterizan comúnmente por tener mejores conexiones a redes de vías arteriales, y una relación lineal con el sistema de vías existentes
            </p>
            <p>
              <span v-html='highlight("Proyectos de Vivienda", "rgb(126, 8, 18)")' /> Los proyectos de vivienda pueden incluir una gama de escenarios de trazados y desarrollos que varían desde grandes torres de apartamentos a casas suburbanas adosadas. Los proyectos de vivienda comparten un aspecto: las estructuras deben ser esencialmente homogéneas.
            </p>
            <p>
              Estas cuatro categorías pretenden reflejar el grado de complejidad de la esfera económica conocida como sector inmobiliario. El sector inmobiliario alcanza su nivel más básico en las áreas de viviendas atomizadas, en donde la organización del sector de viviendas es insuficiente, incluso para asegurar tamaños de lotes y anchos de vías consistentes.
            </p>
            <p>
              El porcentaje de asentamientos en uso residencial en el área de expansión de Portoviejo entre 1990 y 2015 estaba compuesto por: asentamientos atomísticos con 73%; subdivisiones informales con 11.1%; subdivisiones formales con 13.4% y proyectos de vivienda con 2.7%.
            </p>
          </div>
        </div>
        <div class="row border-bottom pb-4 mb-4">
          <div class="col-12">
            <h5 class="text-center">Porcentaje de asentamientos en uso residencial ({{selectYear}})</h5>
            <canvas id='blocks_and_plots_composition_special_stacked' />
          </div>
        </div>
        <div class="row border-bottom mb-4">
          <div class="col-lg-12 mb-4">
            <h3>Promedio del tamaño de las manzanas</h3>
          </div>
        </div>
        <div class="row border-bottom mb-4 pt-2 pb-3">
          <div class="col-12">
            <p>
              El promedio del tamaño de las manzanas del área de expansión formal de Portoviejo era de 210 m<sup>2</sup> entre 1990 y 2015, frente a 259 m<sup>2</sup> en su área anterior a 1990.
            </p>
          </div>
        </div>
        <div class="row pt-4 pb-4 mb-4">
          <div class="col-lg-12 pb-5">
            <canvas id='blocks_plots_average_bar' />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {makeChart, returnSpecialStacked, makeSpecialStacked, makeBlockChart} from '../../assets/graphing.js'
  import BigNum from './BigNum'

  export default {
    name: 'Blocks',
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
          "blocks_land_use_??"
        ],
        allLayers: {},
        layers: [
          {on: true, name: 'blocks_land_use_??', url: '/blocks/land_use_??/'}
        ],
        legend: [
          {name: 'Asentamientos Atomísticos', color: '#CA9179'},
          {name: 'Subdivisiones Informales', color: '#BF614D'},
          {name: 'Subdivisiones Formales', color: '#A4352B'},
          {name: 'Proyectos de Vivienda', color: '#7E0812'},
          {name: 'Espacio Abierto', color: '#7fe900'},
          {name: 'No Residencial', color: '#9ce8ff'}
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
      this.map = L.mapbox.map("mapbox", null, {
        center: [this.city.City.latitude, this.city.City.longitude],
        reuseTiles: true,
        zoom: 13,
        zoomControl: false,
        scrollWheelZoom: false,
        tap: false
      });

      new L.Control.Zoom({ position: "topleft" }).addTo(this.map);

      this.satBG = L.mapbox
        .styleLayer('mapbox://styles/willcmccusker/cj1s0rv49000w2sqm46rsl141')
          .addTo(this.map)
      this.labelsMap = L.mapbox
        .styleLayer("mapbox://styles/willcmccusker/cj1s19z2u000l2snsh0t9i8gw")
        .addTo(this.map);
      this.setLayers();
      this.loadMapLayers();

      this.launchGraphs()
    },
    destroyed () {
      this.destroyGraphs()
    },
    computed: {
      laterYear() {
        return this.selectYear === this.years[1]
      }
    },
    watch: {
      selectYear: function() {
        this.loadMapLayers()
        this.toggleGraphs()
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
      destroyGraphs () {
        for (var key in this.chartObjects) {
          if (this.chartObjects.hasOwnProperty(key)) {
            this.chartObjects[key].destroy()
          }
        }
      },
      blocksAndPlots () {
        let chart = {}
        let id = 'blocks_and_plots_composition_special_stacked'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = makeSpecialStacked(id, this.city, 'Porcentaje de Asentamientos en uso Residencial', this.laterYear)
        this.chartObjects = Object.assign({}, this.chartObjects, chart)
      },
      toggleGraphs () {
        var id = 'blocks_and_plots_composition_special_stacked'
        var meta = returnSpecialStacked(id, this.city, this.laterYear)
        meta.datasets.forEach((dataset, i) => {
          var data = Object.assign({}, dataset.data)
          Object.assign(this.chartObjects[id].config.data.datasets[i].data, data)
        })
        this.chartObjects[id].update()
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
      launchGraphs () {
        let chart = {}
        this.blocksAndPlots()
        let id = 'blocks_plots_average_block_bar'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = makeChart(id, this.city, 'Tamaño de Manzana (Héctares)', ' héctares', undefined, true)
        id = 'blocks_plots_average_bar'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = makeBlockChart(id, this.city, 'Promedio del tamaño de los lotes (m²)', ' m²')
        this.chartObjects = Object.assign({}, this.chartObjects, chart)
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
      highlight(text, background, color='white') {
        return(`<strong style='color: ${color}; padding: 0 5px; background-color: ${background};'><em>${text}</em></strong>`)
      },

    },
    components: {
      BigNum
    }
  }

</script>
