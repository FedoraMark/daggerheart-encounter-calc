<script setup>
	import { computed } from 'vue'

	import BPTick from "./BP_Tick.vue"

	const props = defineProps(['totalBPs', 'spentBPs'])

	const higherTickNumber = computed(() => { return props.totalBPs > props.spentBPs ? props.totalBPs : props.spentBPs })

	function comparedToTotal(bpToCompare) { return Math.sign(props.totalBPs - bpToCompare) }
</script>

<template>
  <div id="BattlePointSDisplay_Wrapper" class="calc_bp-info">
    <ul id="BattlePointsTicks" class="calc_bp-info_list" data-difficulty="default">
      <BPTick v-for="(bpItem, bpIndex) in higherTickNumber" :position="comparedToTotal(bpIndex+1)" :isTicked="bpItem <= props.spentBPs" />
    </ul>

    <div class="calc_bp-info_total">
      <span class="span-label">Total Battle Points:</span>
      <span class="calc_bp-info_total_text">
        <span id="spentBPs" class="calc_bp-info_total_text_number" :data-spent-total-compare="comparedToTotal(props.spentBPs)">{{ props.spentBPs }}</span>

        <span class="calc_bp-info_total_text_slash">/</span>

        <span id="totalBPs" class="calc_bp-info_total_text_number">{{ props.totalBPs }}</span>
      </span>
    </div>
  </div>
</template>

<style lang="scss">
	@use "../sass/BattlePointsDisplay";
</style>
