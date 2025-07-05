<script setup>
	const props = defineProps(["position", "isTicked"])
</script>

<template>
	<li class="bp-tick bp-tick--on" :data-is-ticked="props.isTicked" :data-position="props.position"><!-- empty --></li>
</template>

<style lang="scss">
	@use "../sass/BP_Tick";
</style>