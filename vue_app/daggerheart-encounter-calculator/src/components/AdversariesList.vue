<script setup>
	import { ref } from 'vue'

  import MonsterItem from './MonsterItem.vue'

  const props = defineProps(['numPCs'])

	const adversariesArray = ref([
		    { name: "minions",	cost: 1 }, // multiple up to number of PCs
        { name: "social",	  cost: 1 },
        { name: "support",	cost: 1 },
        // --
        { name: "horde",	  cost: 2 },
        { name: "ranged",   cost: 2 },
        { name: "skulk",	  cost: 2 },
        { name: "standard",	cost: 2 },
        // --
        { name: "leader",	  cost: 3 },
        // --
        { name: "bruiser",	cost: 4 },
        // --
        { name: "solo",     cost: 5 },
	])

</script>

<template>
  <div id="AdversariesList_Wrapper">
    <h3>Adversaries</h3>

    <ul id="MonsterList" class="monster-list">
      <MonsterItem
      	v-for="adversaryItem in adversariesArray"
      	:name="adversaryItem.name"
      	:cost="adversaryItem.cost"
      	:numPCs="props.numPCs"
      />
    </ul>

    <button id="ClearAdversaries">Clear</button>
  </div>
</template>


<style lang="scss" scoped>
	@use "../sass/AdversariesList";
</style>