<template>
  <div class="page">
    <project></project>
  </div>
</template>

<script>
import Project from 'components/Project'

export default {
  components: {
    Project
  }
}
</script>

<style>
.page {
  height: 100%;
  text-align: center;
  /* nesting for the need to test postcss */
  code {
    background-color: #f0f0f0;
    padding: 3px 5px;
    border-radius: 2px;
  }
}
</style>
