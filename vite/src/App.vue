<template>
  <h1>{{ title }}</h1>
</template>

<script>
import { msg } from 'hello'
export default {
  data() {
    return {
      // title: 'Hello Vite & Vue!'
      title: msg
    }
  },
  methods: {
    add() {
      console.log('add')
      this.title = 'add'
    }
  },
  mount() {
    console.log('mounted')
    this.add()
  }
}
</script>

<style scoped>
div {
  color: red;
}
</style>