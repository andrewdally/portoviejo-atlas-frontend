<template :city='city'>
  <div>
    <div class="row border-bottom mt-5">
      <div class="col-lg-10 offset-lg-1">
        <h1 class="mt-5 mb-2">Población</h1>
      </div>
    </div>
    <div class="row border-bottom">
      <div class="col-lg-10 offset-lg-1">
        <h3 class='mt-4 mb-4'>Población</h3>
        <div class='row mt-3 pb-4 mb-4'>
          <div class="col-2">
            <big-num class='mb-3' heading='1985' number='93,426' units='Personas' color='#2e2e76'/>
            <big-num class='mb-3' heading='1998' number='117,845' units='Personas' color='#ac2341'/>
            <big-num class='mb-3' heading='2007' number='170,854' units='Personas' color='#2FA3EB'/>
            <big-num heading='2017' number='211,755' units='Personas' color='#da8b40'/>
          </div>
          <div class='col-10'>
            <canvas id='population_line' class='city-chart'/>
          </div>
        </div>
      </div>
    </div>
    <div class="row border-bottom pt-5 pb-4">
      <div class="col-lg-8 offset-lg-3">
        <div class='row'>
          <p>The Population of Portoviejo in 2017 was 21,1755, increasing at an average annual rate of 2.2% since 2007. The population of Portoviejo in 2007 was 7,0854, increasing at an average annual rate of 4.2% since 1998, when its population was 11,7845.</p>
        </div>
      </div>
    </div>
    <div class="row border-bottom">
      <div class="col-lg-10 offset-lg-1">
        <h3 class='mb-4 mt-4'>Cambio Porcentual</h3>
        <div class='row mt-3'>
          <div class="col-2">
            <big-num class='mb-3' heading='1985-1998' number='-1.7%' color='#FF6A4D'/>
            <big-num heading='1998-2017' number='-3.1%' color='#97928C'/>
          </div>
          <div class='col-10'>
            <canvas id='population_change_bar' class='city-chart'/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BigNum from './BigNum.vue'
  import {makeChart, makeLine} from '../../assets/graphing.js'
  export default {

    name: 'Population',
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
      launchGraphs () {

        let chart = {}
        let id = 'population_line'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = makeLine(id, this.city, 'Population')
        id = 'population_change_bar'
        if (this.chartObjects[id]) this.chartObjects[id].destroy()
        chart[id] = makeChart(id, this.city, 'Population Avg. Annual % Change', '%')

        this.chartObjects = Object.assign({}, this.chartObjects, chart)
      }
    },
    components: {
      BigNum
    }
  }

</script>
