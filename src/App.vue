<template>
  <div id="app">
    <div class="container-fluid">
      <div class="pos-f-t">
        <div class="collapse" id="navbarToggleExternalContent">
          <div class="bg-dark p-4">
            <h5 class="text-white h4">Collapsed content</h5>
            <span class="text-muted">Toggleable via the navbar brand.</span>
          </div>
        </div>
        <nav class="navbar navbar-expand fixed-top navbar-light bg-light">
          <a class="navbar-brand" href="/">Huella Urbana Portoviejo</a>
          <div v-if='isCity()' class="navbar-nav">
            <div class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {{ $route.params.city_slug ? $route.params.city_slug : 'Seleccione una Ciudad' }}
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a href='/' class='dropdown-item'>Inicio</a>
                <router-link :to="{path: '/ciudad/Cordoba', name: 'Ciudad', params: {city_slug: 'Cordoba'}}" class="dropdown-item">Cordoba</router-link>
                <router-link :to="{path: '/ciudad/La_Paz', name: 'Ciudad', params: {city_slug: 'La_Paz'}}" class="dropdown-item">La_Paz</router-link>
                <router-link :to="{path: '/ciudad/Medelin', name: 'Ciudad', params: {city_slug: 'Medelin'}}" class="dropdown-item">Medelin</router-link>
                <router-link :to="{path: '/ciudad/Quito', name: 'Ciudad', params: {city_slug: 'Quito'}}" class="dropdown-item">Quito</router-link>
                <router-link :to="{path: '/ciudad/Rosario', name: 'Ciudad', params: {city_slug: 'Rosario'}}" class="dropdown-item">Rosario</router-link>
                <router-link :to="{path: '/ciudad/Roxborough', name: 'Ciudad', params: {city_slug: 'Roxborough'}}" class="dropdown-item">Roxborough</router-link>
                <router-link :to="{path: '/ciudad/Scarborough', name: 'Ciudad', params: {city_slug: 'Scarborough'}}" class="dropdown-item">Scarborough</router-link>
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
                <router-link to="/autores" class="dropdown-item">Autores</router-link>
                <router-link to="/metodologia" class="dropdown-item">Metodología y Fuentes</router-link>
                <router-link to="/gratitud" class="dropdown-item">Expresiones de gratitud</router-link>
              </div>
            </div>
          </div>
        </nav>
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
</style>
