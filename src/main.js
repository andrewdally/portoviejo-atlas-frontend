String.prototype.replaceAll = function (search, replacement) {
  var target = this
  return target.split(search).join(replacement)
}

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Population from './components/city/Population.vue'
import Density from './components/city/Density.vue'
import AddedArea from './components/city/AddedArea.vue'
import Blocks from './components/city/Blocks.vue'
import Forecasts from './components/city/Forecasts.vue'
import UrbanExtentPopulation from './components/city/UrbanExtentPopulation.vue'
import UrbanComposition from './components/city/UrbanComposition.vue'
import Roads from './components/city/Roads.vue'
import Arterials from './components/city/Arterials.vue'

import About from './components/info/About.vue'
import Contact from './components/info/Contact.vue'
import Data from './components/info/Data.vue'
import Team from './components/info/Team.vue'
import Methodology from './components/info/Methodology.vue'
import Thanks from './components/info/Thanks.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

const routes = [
  { path: '/urban_extent', component: UrbanExtentPopulation, name: 'Huella Urbana y Densidad'},
  { path: '/urban_composition', component: UrbanComposition, name: 'Composición Urbana'},
  { path: '/added_area', component: AddedArea, name: 'Composición del Área Agredada'},
  { path: '/population', component: Population, name: 'Población' },
  { path: '/density', component: Density, name: 'Densidad' },
  { path: '/blocks', component: Blocks, name: 'Manzanas y Lotes'},
  { path: '/forecasts', component: Forecasts, name: 'Proyecciones'},
  { path: '/roads', component: Roads, name: 'Vías'},
  { path: '/arterials', component: Arterials, name: 'Vías Arteriales'},

  { path: '/sobre', component: About, name: 'Sobre el proyecto'},
  { path: '/contacto', component: Contact, name: 'Contacto'},
  { path: '/datos', component: Data, name: 'Datos'},
  { path: '/autores', component: Team, name: 'Autores'},
  { path: '/metodologia', component: Methodology, name: 'Metodología y Fuentes'},
  { path: '/gratitud', component: Thanks, name: 'Expresiones de gratitud'}

]

const router = new VueRouter({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes
})

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
