<script setup>
	import { ref } from 'vue'

	const props = defineProps(['name', 'cost', 'amount', 'numPCs', 'isTooExpensive'])
	const emits = defineEmits(['update-adversaries'])

	const numberOfAdversaries = defineModel({ default: 0 })

	const adversary_id = "adversary_" + props.name
	const isMinions = props.name == "minion"

	const getObject = () => { return {
			"name": props.name,
			"amount": numberOfAdversaries
		}
	}

	function pluralize(singular, plural, number) {
		return number == 1 ? singular : plural;
	}
</script>

<template>
  <li :class="'monster-list_item' + (props.isTooExpensive ? ' monster-list_item--expensive' : '')">
    <label :for="adversary_id" :class="(isMinions && props.numPCs === 1) ? '' : 'is-mulitple-minions'">
      <span class="adv-name">{{ props.name }}<Transition name='note'><span v-if="isMinions && (props.numPCs !== 1)">s</span></Transition>
      </span>

      <span class="adv-bp"><strong>{{ props.cost }}</strong>{{ pluralize('BP', 'BPs', props.cost) }}</span>

      <Transition name="note">
      	<span v-if="isMinions && (props.numPCs > 1)" class="adv-minions-message">group of up to {{ props.numPCs }}</span>
      </Transition>
    </label>

	 	<TransitionGroup tag="ul" name="edge" v-if="isMinions && props.numPCs > 0" class="adv-multi-edge">
	  	<li v-for="player in props.numPCs - 1" :key="player" class="edge-item" :style="{ 'z-index': '-' + player }" />
	  </TransitionGroup>

    <input
    	v-model="numberOfAdversaries"
    	type="number"
    	:name="adversary_id"
    	:id="adversary_id"
    	:data-adversary-name="name"
    	min="0"
    	@change="$emit('update-adversaries', getObject())"
    >

  </li>
</template>

<style lang="scss">
	@use "../sass/MonsterItem";

	// stacked edges
	.edge-enter-active,
	.edge-leave-active {
	  transition: transform var(--short-time) ease-in-out !important;
	}
	.edge-enter-from,
	.edge-leave-to {
	  transform: translateX(110%);
	}

	// note
	.note-enter-active,
	.note-leave-active {
	  transition: opacity var(--short-time) ease;
	}
	.note-enter-from,
	.note-leave-to {
	  opacity: 0 !important;
	}
</style>
