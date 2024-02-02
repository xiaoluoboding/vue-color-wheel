<template>
  <div>Hello {{ msg }} !</div>
</template>

<script lang="ts" setup>
defineProps({
  msg: String
})
</script>
