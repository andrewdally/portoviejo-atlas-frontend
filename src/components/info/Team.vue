<template>
    <div class="row">
      <div id="infoPage" class="col-12">
        <div class="row">
          <div class="col-lg-10 offset-lg-1 mb-5">
            <h1 class="mt-5 mb-5">Autores</h1>
            <div v-for='author in authors'>
              <author-bio
                :image='author.image'
                :lead='author.lead'
                :graphs='author.graphs'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import AuthorBio from './AuthorBio'

export default {
  name: "Team",
  data() {
    return {
      authors: [
        {
          image: '/img/Angel.jpg',
          lead: 'Shlomo (Solly) Angel es profesor de Planeación Urbana y Director del Programa de Expansión Urbana en el Instituto Marron de Gerencia Urbana de la Universidad de Nueva York. El Dr. Angel obtuvo su título de arquitectura y su doctorado en Planeación Urbana Regional den la Universidad de Carolina, Berkeley.',
          graphs: [
            'El Profesor Angel es experto en políticas de vivienda y desarrollo urbano, ha asesorado organismos del sistema de Naciones Unidas, el Banco Mundial y el Banco Interamericano de Desarrollo (BID).',
            'En 1973 inició el programa de Planeación de Asentamientos Humanos y Desarrollo en el Instituto Asiático de Tecnología de Bangkok. Allí enseñó entre 1973 y 1983, mientras realizaba una investigación sobre vivienda y desarrollo urbano en ciudades del este, sur y sureste asiático. ',
            'Desde mediados de los 80s hasta mediados de los 90s, trabajó como consultor en vivienda y desarrollo urbano para ONU-Hábitat, el Banco de Desarrollo Asiático y el Gobierno de Tailandia. En el año 2000 publicó “Housing Policy Matters”, un estudio comparativo de políticas de vivienda alrededor del mundo. Ese mismo año, prepare reportes de políticas de vivienda para 11 países de Latinoamérica y el Caribe para el BID y el Banco Mundial. En 2010 publicó “Planeta de Ciudades”. ',
            'Actualmente se enfoca en la documentación y el estudio de la planeación de la expansión urbana en países en desarrollo.'
          ]
        },
        {
          image: '/img/Sanchez.jpg',
          lead: 'Nicolás Galarza Sánchez es becario académico afiliado en el Programa de Expansión Urbana del Instituto Marron de Gerencia Urbana de la Universidad de Nueva York. Nicolás tiene una Maestría en Planeación Urbana en la Escuela Robert F. Wagner de Servicio Público de la misma universidad. Actualmente se encuentra trabaja para el Ministerio de Vivienda, Ciudad y Territorio en Colombia.',
          graphs: [
            'En su recorrido profesional, sirvió como asesor del director de Estrategia y Superación de Pobreza Extrema de la Presidencia de la República de Colombia y Alto Consejero Presidencial para la Acción Social y la Cooperación Internacional en temas de tecnología cívica e innovación. También fue pesante en el Parlamento Alemán en Berlín y asistente de investigación de la Facultad de Ciencia Política y Relaciones Internacionales de la Universidad del Rosario en Bogotá, Colombia.'
          ]
        },
        {
          image: '/img/Lamson-Hall.jpg',
          lead: 'Patrick Lamson-Hall es becario académico en el Programa de Expansión Urbana del Instituto Marron de Gerencia Urbana de la Universidad de Nueva York. Patrick tiene una Maestría en Planeación urbana en la Escuela Robert F. Wagner de Servicio Público de la misma universidad y se encuentra cursando un Doctorado en Políticas Públicas en la misma universidad.',
          graphs: [
            'Su investigación se enfoca en urbanización en países en vías de desarrollo, desarrollo económico y urbanización histórica.'
          ]
        },
        {
          image: '',
          lead: 'María Mónica Salazar Tamayo es becaria académica en el Programa de Expansión Urbana del Instituto Marron de Gerencia Urbana de la Universidad de Nueva York.',
          graphs: [
            'Antes de mudarse a Nueva York, ella trabajó para el instituto como consultora para América Latina apoyando en especial el proyecto de POTs Modernos de Colombia. También, fue asesora del Sistema General de Regalías del Departamento Nacional de Planeación de Colombia en el cual estaba encargada de apoyar a los gobiernos locales en la implementación de proyectos de inversión y el manejo de las transferencias intergubernamentales.',
            'María Mónica ha trabajado también en temas relacionados con el desarrollo de estrategias locales, participación ciudadana, gobernanza local y transparencia y políticas públicas en el nivel nacional y local. Ha sido profesora en la Universidad Externado de Colombia y la Universidad Sergio Arboleda en temas de Teoría y Diseño de Política Publica y Planificación de Ciudades.',
            'María Mónica tiene una tiene una Maestría en Planeación Urbana en la Escuela Robert F. Wagner de Servicio Público de la Universidad de Nueva York y una Maestría en Gobierno y Política Pública de la Universidad Externado de Colombia.'
          ]
        }
      ]
    }
  },
  components: {
    AuthorBio
  }
}
</script>
