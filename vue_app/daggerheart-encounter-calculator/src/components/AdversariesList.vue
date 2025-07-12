<script setup>
	import { ref } from 'vue'

  import MonsterItem from './MonsterItem.vue'

  const props = defineProps(['numPCs'])
  const emits = defineEmits(['update-adjustments'])

	const adversariesArray = ref([
		    { name: "minion",   cost: 1,  amount: 0 }, // multiple up to number of PCs
        { name: "social",   cost: 1,  amount: 0 },
        { name: "support",  cost: 1,  amount: 0 },
        // --
        { name: "horde",    cost: 2,  amount: 0 },
        { name: "ranged",   cost: 2,  amount: 0 },
        { name: "skulk",    cost: 2,  amount: 0 },
        { name: "standard",	cost: 2,  amount: 0 },
        // --
        { name: "leader",	  cost: 3,  amount: 0 },
        // --
        { name: "bruiser",  cost: 4,  amount: 0 },
        // --
        { name: "solo",     cost: 5,  amount: 0 },
	])

  const totalSpent = ref(0)

  function calculateSpentBPs() {
    let updatedSpent = 0
    for (const adversary of adversariesArray.value) {
      updatedSpent += adversary.amount * adversary.cost
    }

    totalSpent.value = updatedSpent;
  }

  const getMonsterIndexByName = monsterName => { return adversariesArray.value.findIndex((e) => monsterName == e.name) }

  function updateAdversaries(monsterObject) {
    adversariesArray.value[getMonsterIndexByName(monsterObject.name)].amount = monsterObject.amount
    calculateSpentBPs()
  }

  function clearAdversaries() {
    for (let monsterIndex = 0; monsterIndex < adversariesArray.value.length; monsterIndex++) {
      adversariesArray.value[monsterIndex].amount = 0
    }
    calculateSpentBPs()
  }

  const isUsingMultipleSolos = () => { return adversariesArray.value[getMonsterIndexByName("solo")].amount > 1 }

  const isLackingBHLS = () => {
    return (
      adversariesArray.value[getMonsterIndexByName("bruiser")].amount < 1 &&
      adversariesArray.value[getMonsterIndexByName("horde")].amount < 1 &&
      adversariesArray.value[getMonsterIndexByName("leader")].amount < 1 &&
      adversariesArray.value[getMonsterIndexByName("solo")].amount < 1
    )
  }
</script>

<template>
  <div id="AdversariesList_Wrapper">
    <h3>Adversaries</h3>

    <ul id="MonsterList" class="monster-list">
      <MonsterItem
      	v-for="adversaryObject in adversariesArray"
        :key="adversaryObject.name"
      	:name="adversaryObject.name"
        :cost="adversaryObject.cost"
        :amount="adversaryObject.amount"
      	:numPCs="props.numPCs"
        :isTooExpensive="false"
        @update-adversaries="updateAdversaries"
        @change="$emit('update-adjustments', totalSpent, isUsingMultipleSolos(), isLackingBHLS())"
      />
      <!-- TODO: tint red if too expensive -->
    </ul>

    <button id="ClearAdversaries" @click="clearAdversaries(); $emit('update-adjustments', totalSpent, isUsingMultipleSolos(), isLackingBHLS())">Clear</button>
  </div>
</template>


<style lang="scss" scoped>
	@use "../sass/AdversariesList";
</style>