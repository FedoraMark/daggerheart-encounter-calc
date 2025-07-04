<script setup>
	const props = defineProps(['name', 'cost', 'numberOfPlayers'])

	const bp_display_text = props.cost === 1 ? "BP" : "BPs"
	const adversary_id = "adversary_" + props.name
</script>

<template>
  <li class="monster-list_item">
  	<label :for="adversary_id">
  		<span class="adv-name">{{ name }}</span>
  		<span class="adv-bp"><strong>{{ cost }}</strong>{{ bp_display_text }}</span>
  		<span v-if="props.name == 'minions'" class="adv-minions-message">group of up to {{ numberOfPlayers }}</span>
  	</label>

    <input value="0" type="number" :name="adversary_id" :id="adversary_id" :data-adversary-name="name" min="0">

  </li>
</template>


<style lang="scss">
	@use "../sass/MonsterItem";
</style>
