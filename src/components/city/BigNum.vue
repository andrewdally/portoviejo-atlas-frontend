<template>
  <div class="bigNum">
    <div class="super">{{this.heading}}</div>
    <div class="number" v-bind:style='{color: this.color}'>{{this.number}}</div>
    <div><small class="sub muted">{{this.units}}</small></div>
  </div>
</template>

<script>
  export default {
    name: 'BigNum',
    props: ['number', 'color', 'heading', 'units']
  }
</script>

<style>
.bigNum .number {
  font-size: 48px;
  margin: -10px 0 -12px;
  font-weight: 700;
}
.super {
  font-weight: 700;
}

</style>
