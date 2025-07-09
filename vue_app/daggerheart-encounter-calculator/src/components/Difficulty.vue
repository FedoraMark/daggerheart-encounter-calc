<script setup>
  const EASY = -1
  const AVERAGE = 0
  const HARD = 2

  const props = defineProps({
    currentDifficulty: {type: String, required: true, default: AVERAGE}
  })
  const emits = defineEmits(['set-difficulty'])

  function isDifficulty(compareTo) {
    return props.currentDifficulty == compareTo
  }
</script>

<template>
  <div id="Difficulty_Wrapper" class="difficulty">
    <h3>Difficulty</h3>
    <ul id="DifficultyList" class="difficulty_list">
      <li class="difficulty_list_item">
        <button id="Diff-Easier"  :data-active="isDifficulty(EASY)"     @click="$emit('set-difficulty', EASY)"     >Easier<span>&minus;1</span></button>
        <button id="Diff-Average" :data-active="isDifficulty(AVERAGE)"  @click="$emit('set-difficulty', AVERAGE)"  >Average</button>
        <button id="Diff-Harder"  :data-active="isDifficulty(HARD)"     @click="$emit('set-difficulty', HARD)"     >Harder<span>&plus;2</span></button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
  @use "../sass/Difficulty";
</style>
