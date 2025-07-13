<script setup>
	import { ref } from 'vue'

	const props = defineProps(['id', 'text', 'modifier', 'isActive'])
	const emits = defineEmits(['toggle-option-by-id'])
</script>

<template>
	<li :id="'opt-'+props.id" class="option" :data-is-active="props.isActive">
		<span class="option_text">{{ props.text }}</span>
		<button class="option_toggle" @click="$emit('toggle-option-by-id', props.id)">
			<span class="option_toggle_text">{{ props.modifier < 1 ? "&minus;"+Math.abs(props.modifier) : "&plus;"+props.modifier }}</span>
		</button>
	</li>
</template>

<style lang="scss">
	@use "../sass/Option";
</style>