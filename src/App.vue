<template>
  <div id="app">
    <div class="container-fluid">
        <nav class="navbar navbar-expand fixed-top navbar-light bg-light">
        <a class="navbar-brand" href="/">Huella Urbana Portoviejo</a>
        <div v-if='isCity()' class="navbar-nav">
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {{ $route.name ? $route.name : 'Seleccione una Base de Datos' }}
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a href='/' class='dropdown-item'>Inicio</a>
              <router-link to="/urban_extent" class="dropdown-item">Huella Urbana y Densidad</router-link>
              <router-link to="/urban_composition" class="dropdown-item">Composición Urbana</router-link>
              <router-link to="/added_area" class="dropdown-item">Área Agredada</router-link>
              <router-link to="/roads" class="dropdown-item">Vías</router-link>
              <router-link to="/arterials" class="dropdown-item">Vías Arteriales</router-link>
              <router-link to="/blocks" class="dropdown-item">Manzanas y Lotes</router-link>
              <router-link to="/forecasts" class="dropdown-item">Proyecciones</router-link>
            </div>
          </div>
        </div> <!-- End of navbar-nav -->
        <div class="navbar-nav ml-auto">
          <div class='nav-item dropdown'>
            <a class="nav-link dropdown-toggle" href="#" id="aboutDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="navbar-toggler-icon"></span>
            </a>
            <div class='dropdown-menu dropdown-menu-right'>
              <router-link to="/sobre" class="dropdown-item">Sobre el proyecto</router-link>
              <router-link to="/datos" class="dropdown-item">Datos</router-link>
              <router-link to="/contacto" class="dropdown-item">Contacto</router-link>
              <router-link to="/autores" class="dropdown-item">Autores</router-link>
              <router-link to="/metodologia" class="dropdown-item">Metodología y Fuentes</router-link>
              <router-link to="/gratitud" class="dropdown-item">Expresiones de gratitud</router-link>
            </div>
          </div>
        </div>
      </nav>
        <div class="row">
          <div id="logos" class="table-responsive">
            <table class="table table-borderless table-light">
              <tr style="width: 100%">
                <td style="width:33%" class="text-center">
                  <img class="align-middle" src="img/caf-logo.png" />
                </td>
                <td style="width:33%" class="text-center">
                  <img class="align-middle" style="max-height: 45px;" src="img/marron-logo.png" />
                </td>
                <td style="width:33%" class="text-center">
                  <img class="align-middle" src="img/portoviejo-logo.png" />
                </td>
              </tr>
            </table>
          </div>
        </div>
      <div v-if='!$route.name' class="row">
        <div class="col-12">
          <div id="city-home" class='row'>
            <div class='col-sm-4 mb-5 text-center'>
              <big-num heading='2017 Huella Urbana' number='5,176' units='Hectáreas' color='#fff'/>
            </div>
            <div class='col-sm-4 mb-5 text-center'>
              <big-num heading='2017 Población' number='211,755' units='Personas' color='#fff'/>
            </div>
            <div class='col-sm-4 mb-5 text-center'>
              <big-num heading='2017 Densidad' number='68' units='personas/hectárea' color='#fff'/>
            </div>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import BigNum from './components/city/BigNum'
export default {
  name: 'app',
  methods: {
    isCity() {
      var infoPages = ['/sobre', '/autores', '/metodologia', '/gratitud', '/datos']
      return !infoPages.includes(this.$route.fullPath)
    }
  },
  components: {
    BigNum
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
@import 'assets/colors';
@import 'assets/vars';

html, body{
  height: 100%;
}
body {
  background: url('/img/portoviejo-lights.png') no-repeat center center fixed;
  background-size: cover;
}
#city-home {
  margin-top: 40vh;
}
#city-home .bigNum {
  color: white !important;
  display: inline-block;
  height: 100%;
}

#logos img {
  max-width: 100%;
  max-height: 60px;
  width: auto;
}
#logos {
  position: fixed;
  top: 56px;
  z-index: 100;
}

@media (max-width: 576px) {
  #logos {
    margin-bottom: 25vh;
  }
}
.btn-1985, .btn-1998, .btn-2007, .btn-2017{
  color: white;
  cursor: pointer;
}
.btn-1985.active, .btn-1985:hover, .btn-1998.active, .btn-1998:hover, .btn-2017.active, .btn-2017:hover{
  color: white;
}
.btn-1985.active {
  background: rgba(46, 46, 118, 1) !important;
  border-color: rgba(46, 46, 118, 1) !important;
}
.btn-1998.active {
  background: rgba(172, 35, 65, 1) !important;
  border-color: rgba(172, 35, 65, 1) !important;
}
.btn-2007.active {
  background: rgba(47, 163, 235, 1) !important;
  border-color: rgba(47, 163, 235, 1) !important;
}
.btn-2017.active {
  background: rgba(218, 139, 64, 1) !important;
  border-color: rgba(218, 139, 64, 1) !important;
}
.btn-1985:hover {
  background: rgba(46, 46, 118, .8);
  border-color: rgba(46, 46, 118, .8);
}
.btn-1998:hover {
  background: rgba(172, 35, 65, .8);
  border-color: rgba(172, 35, 65, .8);
}
.btn-2007:hover {
  background: rgba(47, 163, 235, .8) !important;
  border-color: rgba(47, 163, 235, .8) !important;
}

.btn-2017:hover {
  background: rgba(218, 139, 64, .8);
  border-color: rgba(218, 139, 64, .8);
}
.btn input[type="radio"], .btn input[type="checkbox"] {
  position: absolute;
  top: -1500px;
}
.navbar-expand .navbar-toggler {
  display: block;
}
#infoPage {
  background: white;
  margin-top: 120px;
  min-height: 100vh;
}
#cityData {
  background: white;
  margin-right: -30px;
  z-index: 3;
  margin-top: 100vh;
  margin-top: 120px;
}
@media (min-width: 992px) {
  #cityData {
    margin-top: 120px;
  }
}
.legend-item {
  display: inline-block;
  width: 20px;
  height: 15px;
  margin-bottom: -3px;
}
#map-key {
  background: white;
  padding: 5px;
  font-size: 13px;
  position: fixed;
  top: 160px;
  right: 20px;
  width: 210px;
  z-index: 2;
  text-align: left;
}
</style>
