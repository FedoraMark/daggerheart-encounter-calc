<script setup>
	import { ref } from 'vue'

	const props = defineProps(['name', 'cost', 'amount', 'numPCs'])
	const emits = defineEmits(['update-adversaries'])

	const numberOfAdversaries = defineModel({ default: 0 })

	const bp_display_text = props.cost === 1 ? "BP" : "BPs"
	const adversary_id = "adversary_" + props.name
	const isMinions = props.name == "minions"

	const getObject = () => { return {
			"name": props.name,
			"amount": numberOfAdversaries
		}
	}
</script>

<template>
  <li class="monster-list_item">
    <label :for="adversary_id">
      <span class="adv-name">{{ props.name }}</span>
      <span class="adv-bp"><strong>{{ props.cost }}</strong>{{ bp_display_text }}</span>
      <span v-if="isMinions" class="adv-minions-message">group of up to {{ props.numPCs }}</span>
    </label>

	 	<TransitionGroup tag="ul" v-if="isMinions && props.numPCs > 0" class="adv-multi-edge">
	  	<li v-for="player in props.numPCs - 1" :key="player" class="edge-item" :style="{ 'z-index': '-' + player }"><!-- empty --></li>
	  </TransitionGroup>

    <input v-model="numberOfAdversaries" @change="$emit('update-adversaries', getObject())" type="number" :name="adversary_id" :id="adversary_id" :data-adversary-name="name" min="0">

  </li>
</template>

<style lang="scss">
	@use "../sass/MonsterItem";

	.v-enter-active,
	.v-leave-active {
	  transition: transform 0.15s ease-out !important;
	}
	.v-enter-from,
	.v-leave-to {
	  transform: translateX(110%);
	}
</style>
