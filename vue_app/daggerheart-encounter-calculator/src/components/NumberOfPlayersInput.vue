<script setup>
	import { ref } from 'vue'

	const numPcs_model = defineModel({ default: 4 })
</script>

<template>
  <div id="NumberOfPlayersWrapper" class="num-pcs">
    <div class="num-pcs_info">
      <label for="number-of-players">Number of PCs:</label>
      <input v-model="numPcs_model" type="number" name="number-of-players" id="number-of-players" min="1" max="9">
    </div>

    <!--
    <div class="num-pcs_difficulty">
        <label for="difficulty-adjustment">Difficulty:</label>
        <select name="difficulty-adjustment" id="difficulty-adjustment">
            <option value="easy">Easy/Short (-1)</option>
            <option value="default" selected>Normal</option>
            <option value="hard">Hard/Long (+2)</option>
        </select>
    </div>
    -->
  </div>
</template>

<style lang="scss" scoped>
  @use "../sass/NumberOfPlayersInput"
</style>
