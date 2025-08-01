<script setup>
	import { ref } from 'vue'

	const props = defineProps(['id', 'text', 'modifier', 'isActive'])
</script>

<template>
	<li :id="'opt-'+props.id" class="adjustment" :data-is-active="props.isActive">
		<span class="adjustment_text force-wrap">{{ props.text }}</span>
		<span class="adjustment_modifier">{{ props.modifier < 1 ? "&minus;"+Math.abs(props.modifier) : "&plus;"+props.modifier  }}</span>
	</li>
</template>

<style lang="scss">
	@use "../sass/Adjustment";
</style>