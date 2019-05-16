<template :city='city'>
  <div>
    <div class="row border-bottom mt-5">
      <div class="col-lg-10 offset-lg-1">
        <h1 class="mt-5 mb-2">Densidad</h1>
      </div>
    </div>
    <div class="row border-bottom">
      <div class="col-lg-10 offset-lg-1">
        <h3 class='mt-4 mb-4'>Densidad del Área Edificada</h3>
        <div class='row mt-3 pb-4 mb-4'>
          <div class="col-2">
            <big-num class='mb-3' heading='1985' number='154' units='Personas/Hectáreas' color='#2e2e76'/>
            <big-num class='mb-3' heading='1998' number='89' units='Personas/Hectáreas' color='#ac2341'/>
            <big-num class='mb-3' heading='2007' number='85' units='Personas/Hectáreas' color='#2FA3EB'/>
            <big-num heading='2017' number='68' units='Personas/Hectáreas' color='#da8b40'/>
          </div>
          <div class='col-10'>
            <canvas id='density_built_up_line' class='city-chart'/>
          </div>
        </div>
      </div>
    </div>
    <div class="row border-bottom pt-5 pb-4">
      <div class="col-lg-8 offset-lg-3">
        <div class='row'>
          <p>The Built-up Area Density in Portoviejo in 2017 was 68 persons per hectare, decreasing at an average annual rate of -1.41% since 1998. The built-up area density in 1998 was 89 persons per hectare, decreasing at an average annual rate of -4.1% since 1985 when the built-up area density was 154 persons per hectare. </p>
          <p>Built-up area refers to technically impervious surface, corresponding to built-up areas, identified from 30m x 30m Landsat pixels. Built-up area pixels are sub-categorized into three types: urban, suburban, and rural depending on the share of built-up pixels within a given pixel’s 1km2 circle: urban pixels have the majority of built-up pixels (&gt;50%), suburban pixels have 25-50% built-up pixels, and rural pixels have &lt;25% of built-up pixels within their 1 km2 circle. The urban, suburban, and rural labels are used in a suggestive manner; their threshold values do not imply intrinsic definitions.</p>
        </div>
      </div>
    </div>
    <div class="row border-bottom">
      <div class="col-lg-10 offset-lg-1">
        <h3 class='mb-4 mt-4'>Cambio Porcentual</h3>
        <div class='row mt-3'>
          <div class="col-2">
            <big-num class='mb-3' heading='1985-1998' number='-4.1%' units='Cambio Porcentual' color='#FF6A4D'/>
            <big-num heading='1998-2017' number='-1.41%' units='Cambio Porcentual' color='#97928C'/>
          </div>
          <div class='col-10'>
            <canvas id='density_built_up_change_bar' class='city-chart'/>
          </div>
        </div>
      </div>
    </div>
    <div class="row border-bottom">
      <div class="col-lg-10 offset-lg-1">
        <h3 class='mt-4 mb-4'>Densidad de la Huella Urbana </h3>
        <div class='row mt-3 pb-4 mb-4'>
          <div class="col-2">
            <big-num class='mb-3' heading='1985' number='80.9' units='Personas/Hectáreas' color='#2e2e76'/>
            <big-num class='mb-3' heading='1998' number='52.3' units='Personas/Hectáreas' color='#ac2341'/>
            <big-num class='mb-3' heading='2007' number='50.6' units='Personas/Hectáreas' color='#2FA3EB'/>
            <big-num heading='2017' number='42.3' units='Personas/Hectáreas' color='#da8b40'/>
          </div>
          <div class='col-10'>
            <canvas id='density_urban_extent_line' class='city-chart'/>
          </div>
        </div>
      </div>
    </div>
    <div class="row border-bottom pt-5 pb-4">
      <div class="col-lg-8 offset-lg-3">
        <div class='row'>
          <p>The Urban Extent Density in Portoviejo in 2017 was 42.3 persons per hectare, decreasing at an average annual rate of -1.14% since 1998. The built-up area density in 1998 was 52.3 persons per hectare, decreasing at an average annual rate of -3.23% since 1985 when the built-up area density was 80.9 persons per hectare.</p>
          <p>Urban extent is the combined built-up area and open space associated a city at a given date. The urban extent is derived by applying an ‘inclusion rule’ to urban clusters across the study area. </p>
        </div>
      </div>
    </div>
    <div class="row border-bottom">
      <div class="col-lg-10 offset-lg-1">
        <h3 class='mb-4 mt-4'>Cambio Porcentual</h3>
        <div class='row mt-3'>
          <div class="col-2">
            <big-num class='mb-3' heading='1985-1998' number='-3.23%' units='Cambio Porcentual' color='#FF6A4D'/>
            <big-num heading='1998-2017' number='-1.14%' units='Cambio Porcentual' color='#97928C'/>
          </div>
          <div class='col-10'>
            <canvas id='density_urban_extent_change_bar' class='city-chart'/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {makeChart, makeLine} from '../../assets/graphing.js'
  import BigNum from './BigNum'
  export default {
    name: 'Density',
    data () {
      return {
        chartObjects: {},
        laterYear: true,
        city: window.city
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
      section () {
        this.destroyGraphs()
        this.$nextTick(() => {
          this.launchGraphs()
        })
      },
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
      launchGraphs () {

        let chart = {}

        let id = 'density_built_up_line'
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

        this.chartObjects = Object.assign({}, this.chartObjects, chart)
      }
    },
    components: {
      BigNum
    }
  }

</script>
