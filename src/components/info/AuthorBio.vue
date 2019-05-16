<template>
  <div>
    <div class="row mb-3 mt-5">
      <div class="col-sm-3">
        <img :src="image" class="img-fluid img-thumbnail" alt="Responsive image">
      </div>
      <div class="col-sm-9">
        <p class="lead">{{lead}}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <p v-for='graph in graphs'>{{graph}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AuthorBio',
    props: ['image', 'lead', 'graphs']
  }
</script>
