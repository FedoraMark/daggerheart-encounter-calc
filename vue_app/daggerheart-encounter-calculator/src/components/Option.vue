<script setup>
	import { ref } from 'vue'

	const props = defineProps(['id', 'text', 'modifier', 'isActive'])
</script>

<template>
	<li :id="'opt-'+props.id" class="option" :data-is-active="props.isActive">
		<span class="option_text">{{ props.text }}</span>
		<span class="option_modifier">{{ props.modifier < 1 ? "&minus;"+Math.abs(props.modifier) : "&plus;"+props.modifier  }}</span>
	</li>
</template>

<style lang="scss">
	@use "../sass/Option";
</style>