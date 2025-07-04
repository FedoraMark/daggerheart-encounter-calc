<script setup>
	import { computed } from 'vue'

	const props = defineProps(['name', 'cost', 'numberOfPlayers'])

	let currentNumberOfPlayers = computed(() => props.numberOfPlayers)
	const bp_display_text = props.cost === 1 ? "BP" : "BPs"
	const adversary_id = "adversary_" + props.name
	const isMinions = props.name == "minions"
</script>

<template>
  <li class="monster-list_item">
    <label :for="adversary_id">
      <span class="adv-name">{{ name }}</span>
      <span class="adv-bp"><strong>{{ cost }}</strong>{{ bp_display_text }}</span>
      <span v-if="isMinions" class="adv-minions-message">group of up to {{ currentNumberOfPlayers }}</span>
    </label>

	 	<TransitionGroup tag="ul" v-if="isMinions && currentNumberOfPlayers > 0" class="adv-multi-edge">
	  	<li v-for="player in currentNumberOfPlayers - 1" :key="player" class="edge-item" :style="{ 'z-index': '-' + player }"><!-- empty --></li>
	  </TransitionGroup>

    <input value="0" type="number" :name="adversary_id" :id="adversary_id" :data-adversary-name="name" min="0">

  </li>
</template>

<style lang="scss">
	@use "../sass/MonsterItem";

	.v-enter-active,
	.v-leave-active {
	  transition: transform 0.25s ease !important;
	}
	.v-enter-from,
	.v-leave-to {
	  transform: translateX(110%);
	}
</style>
