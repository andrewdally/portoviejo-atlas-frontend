<template>
   <div id='section-graphs'>

    <div>
      <div class='grid change-years'>
        <div class='col-1-1'>
          <div @click='laterYear = false' class='change-year' :class="{currentYear: !laterYear}">{{earlyRange}}</div>
          <div @click='laterYear = true' class='change-year' :class="{currentYear: laterYear}">{{laterRange}}</div>
        </div>
      </div>
    </div>

<!--          POPULATION          -->
    <div>
      <div class='grid' >
        <div class='col-1-2 tab-1-1' v-html="canvas('population_line')"></div>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad no-pad tab-1-1' v-html="canvas('population_change_bar', '300px')"></div>
          <div class='hold-legend col-1-4 no-pad no-pad tab-1-1' v-html="legend('population_change_bar')"></div>
        </div>
      </div>
    </div>
<!--          URBAN EXTENT          -->
    <div>
      <div class='grid'>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad no-pad tab-1-1' v-html="canvas('urban_extent_composition_stacked_bar', '300px')"></div>
          <div class='hold-legend col-1-4 no-pad no-pad tab-1-1' v-html="legend('urban_extent_composition_stacked_bar')"></div>
        </div>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad no-pad tab-1-1' v-html="canvas('urban_extent_change_bar', '300px')"></div>
          <div class='hold-legend col-1-4 no-pad no-pad tab-1-1' v-html="legend('urban_extent_change_bar')"></div>
        </div>
      </div>
    </div>
<!--          DENSITY          -->
    <div>
      <div class='grid'>
        <div class='col-1-2 tab-1-1' v-html="canvas('density_built_up_line', undefined, undefined)"></div>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad no-pad mob-1-1' v-html="canvas('density_built_up_change_bar', '300px')"></div>
          <div class='hold-legend col-1-4 no-pad no-pad tab-1-1' v-html="legend('density_built_up_change_bar')"></div>
        </div>
      </div>
      <div class='grid'>
        <div class='col-1-2 tab-1-1' v-html="canvas('density_urban_extent_line', undefined, undefined)"></div>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad no-pad tab-1-1' v-html="canvas('density_urban_extent_change_bar', '300px')"></div>
          <div class='hold-legend col-1-4 no-pad no-pad tab-1-1' v-html="legend('density_urban_extent_change_bar')"></div>
        </div>
      </div>
    </div>
<!--          COMPOSITION OF ADDED AREA          -->
    <div>
    </div>
<!--          ROADS          -->
    <div>
      <div class='grid'>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad tab-1-1' v-html="canvas('roads_in_built_up_area_bar', '300px')"></div>
          <div class='col-1-4 no-pad tab-1-1'>
            <div class='hold-legend' v-html="legend('roads_in_built_up_area_bar')"></div>
          </div>
        </div>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad tab-1-1'  v-html="canvas('roads_average_width_bar', '300px')"></div>
          <div class='col-1-4 no-pad tab-1-1'>
            <div class='hold-legend' v-html="legend('roads_average_width_bar')"></div>
          </div>
        </div>
      </div>
      <div class='grid'>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad tab-1-1' v-html="canvas('roads_width_stacked_bar', '300px')"></div>
          <div class='col-1-4 no-pad tab-1-1'>
            <div class='hold-legend' v-html="legend('roads_width_stacked_bar')"></div>
          </div>
        </div>
      </div>
    </div>
<!--          ARTERIAL ROADS          -->
    <div>
      <div class='grid'>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad tab-1-1' v-html="canvas('arterial_roads_density_bar', '300px')"></div>
          <div class='col-1-4 no-pad tab-1-1'>
            <div class='hold-legend' v-html="legend('arterial_roads_density_bar')"></div>
          </div>
        </div>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad tab-1-1' v-html="canvas('arterial_roads_walking_bar', '300px')"></div>
          <div class='col-1-4 no-pad tab-1-1'>
            <div class='hold-legend' v-html="legend('arterial_roads_walking_bar')"></div>
          </div>
        </div>
      </div>
      <div class='grid'>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad tab-1-1' v-html="canvas('arterial_roads_beeline_bar', '300px')"></div>
          <div class='col-1-4 no-pad tab-1-1'>
            <div class='hold-legend' v-html="legend('arterial_roads_beeline_bar')"></div>
          </div>
        </div>
      </div>
    </div>
<!--          BLOCKS AND PLOTS          -->
    <div>
      <div class='grid'>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad tab-1-1' v-html="canvas('blocks_and_plots_composition_special_stacked', '300px')"></div>
          <div class='col-1-4 no-pad tab-1-1'>
            <div class='hold-legend' v-html="legend('blocks_and_plots_composition_special_stacked')"></div>
          </div>
        </div>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad tab-1-1' v-html="canvas('blocks_plots_average_block_bar', '300px')"></div>
          <div class='col-1-4 no-pad tab-1-1'>
            <div class='hold-legend' v-html="legend('blocks_plots_average_block_bar')"></div>
          </div>
        </div>
      </div>
      <div class='grid'>
        <div class='col-1-2 tab-1-1'>
          <div class='col-3-4 no-pad tab-1-1' v-html="canvas('blocks_plots_average_bar', '300px')"></div>
          <div class='col-1-4 no-pad tab-1-1'>
            <div class='hold-legend' v-html="legend('blocks_plots_average_bar')"></div>
          </div>
        </div>
      </div>
    </div>

    <!--          FORECASTS          -->
    <div>
      <div class='grid' >
        <div class='col-1-2 tab-1-1' v-html="canvas('built_up_area_forecast_line')"></div>
        <div class='col-1-2 tab-1-1' v-html="canvas('urban_extent_forecast_line')"></div>
      </div>
    </div>

  </div>
</template>

<script>
  // import clone from '../assets/utils.js'
  import {makeChart, makeLine, makeStacked, makeRoadChart, makeBlockChart, makeSpecialStacked, returnRoadChartData, returnSpecialStacked, drawForecasts} from '../assets/graphing.js'
  export default {

    name: 'Graphs',
    //props: ['section', 'city'],
    data () {
      return {
        city: window.city,
        chartObjects: {},
        laterYear: true,
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
    },
    destroyed () {
      this.destroyGraphs()
    },
    watch: {
      //section () {
      //  this.destroyGraphs()
      //  this.$nextTick(() => {
      //    this.launchGraphs()
      //  })
      //},
      laterYear () {
        this.changeYear()
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
      canvas (id, width = '400px', height = '300px') {
        return `<canvas id='` + id + `' class='city-graphic'  width="` + width + `" height="` + height + `"></canvas>`
      },
      legend (id) {
        return this.chartObjects[id] && this.chartObjects[id].generateLegend()
      },
      arterialRoads () {
        let chart = {}
        let id = 'arterial_roads_density_bar'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = makeRoadChart(id, this.city, 'Density of Arterial Roads (km/km&sup2;)', ' km/km&sup2;', undefined, this.laterYear)
        id = 'arterial_roads_walking_bar'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = makeRoadChart(id, this.city, 'Share of Area Within Walking Distance of Arterial Roads', '%', 100, this.laterYear)
        id = 'arterial_roads_beeline_bar'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = makeRoadChart(id, this.city, 'Beeline Distance to Arterial Roads', 'm', undefined, this.laterYear)
        this.chartObjects = Object.assign({}, this.chartObjects, chart)
      },
      blocksAndPlots () {
        let chart = {}
        let id = 'blocks_and_plots_composition_special_stacked'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = makeSpecialStacked(id, this.city, 'Share of Residential Land Use Settlements', this.laterYear)
        this.chartObjects = Object.assign({}, this.chartObjects, chart)
      },
      changeYear () {
        // switch (this.section.section) {
        //   case ('arterial-roads'):
        //     var roads = ['arterial_roads_density_bar', 'arterial_roads_walking_bar', 'arterial_roads_beeline_bar']
        //     roads.forEach((road) => {
        //       var meta = returnRoadChartData(road, this.city, this.laterYear)
        //       meta.datasets.forEach((dataset, i) => {
        //         var data = Object.assign({}, dataset.data)
        //         Object.assign(this.chartObjects[road].config.data.datasets[i].data, data)
        //       })
        //       this.chartObjects[road].update()
        //     })
        //     break
        //   case ('blocks-and-plots'):
        //     var id = 'blocks_and_plots_composition_special_stacked'
        //     var meta = returnSpecialStacked(id, this.city, this.laterYear)
        //     meta.datasets.forEach((dataset, i) => {
        //       var data = Object.assign({}, dataset.data)
        //       Object.assign(this.chartObjects[id].config.data.datasets[i].data, data)
        //     })
        //     this.chartObjects[id].update()
        //     break
        // }
      },
      launchGraphs () {
        let chart = {}

            let id = 'population_line'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeLine(id, this.city, 'Population')
            id = 'population_change_bar'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeChart(id, this.city, 'Population Avg. Annual % Change', '%')

            id = 'urban_extent_composition_stacked_bar'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeStacked(id, this.city, 'Urban Composition')
            id = 'urban_extent_change_bar'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeChart(id, this.city, 'Urban Extent Avg. Annual % Change')

            id = 'density_built_up_line'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeLine(id, this.city, 'Built-up Area Density (Persons/Hectare)', ' Persons/Hectare')
            id = 'density_built_up_change_bar'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeChart(id, this.city, 'Built-up Area Avg. Annual % Change')
            id = 'density_urban_extent_line'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeLine(id, this.city, 'Urban Extent Density (Persons/Hectare)', ' Persons/Hectare')
            id = 'density_urban_extent_change_bar'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeChart(id, this.city, 'Urban Extent Avg. Annual % Change')

            id = 'roads_in_built_up_area_bar'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeChart(id, this.city, 'Share of built up area occupied by roads and boulevardse', '%', 100, true)
            id = 'roads_average_width_bar'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeChart(id, this.city, 'Average Street Width', 'm', undefined, true)
            id = 'roads_width_stacked_bar'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeStacked(id, this.city, 'Street Width Composition', undefined, undefined, true)

            this.arterialRoads()

            this.blocksAndPlots()
            id = 'blocks_plots_average_block_bar'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeChart(id, this.city, 'Average Block Size (hectares)', ' hectares', undefined, true)
            id = 'blocks_plots_average_bar'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = makeBlockChart(id, this.city, 'Average Plot Size (m&sup2;)', ' m&sup2;')

            id = 'built_up_area_forecast_line'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = drawForecasts(id, this.city)

            id = 'urban_extent_forecast_line'
            if (this.chartObjects[id]) this.chartObjects[id].destroy()
            chart[id] = drawForecasts(id, this.city)

        this.chartObjects = Object.assign({}, this.chartObjects, chart)
      }
    }
  }

</script>

<style lang="scss">
@import '../assets/colors';
@import '../assets/vars';

.change-years {
  padding-bottom:16px;
  padding-top:16px;
}
.change-year {
  cursor: pointer;
  display: inline-block;
  float:left;
  width:100px;
  border:1px solid $line-grey-4;
  text-align:center;
  font-size:12.5px;
  line-height:29px;
  height:29px;
  color: $light-grey;
  &.currentYear {
    font-weight: bold;
    color: $dark-grey-2;
    background-color: $light-grey-3;
  }
}
#section-graphs {
  position:relative;
  z-index: 1;
  padding-left: 306px;
  padding-right:16px;
  & > div {
    background-color: white;
  }
}
canvas {
  max-width:100%;
  margin-left:auto;
}

#population_line,
#population_change_bar,
#urban_extent_composition_stacked_bar,
#urban_extent_change_bar,
#density_urban_extent_line,
#density_urban_extent_change_bar{
  $height: (233 + 54 + (32 * 2)) / 2;
  // max-height: calc(50vh - #{$height}px);
}
#density_built_up_change_bar,
#density_built_up_line,
#density_urban_extent_line,
#density_urban_extent_change_bar,
#roads_in_built_up_area_bar,
#roads_average_width_bar {
  $height: (482 + (32 * 2)) / 2;
  // max-height: calc(50vh - #{$height}px);
}

@media only screen and (min-width : 0) and (max-width : $tablet-max-width)  {

  #section-graphs {
    padding-left:  0px;
    padding-right: 0px;
    & > div {
      background-color: white;
    }
  }

  canvas {
    margin:auto;
    margin-top:32px;
  }
  .hold-legend {
    text-align:center;
    margin-bottom:32px;
  }
  .legend-ul {
    display:inline-block;
    margin-left:auto;
    margin-right:auto;
  }
}
</style>
