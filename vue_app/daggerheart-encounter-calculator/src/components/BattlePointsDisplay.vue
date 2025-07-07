<script setup>
	import { computed } from 'vue'

	import BPTick from "./BP_Tick.vue"

	const props = defineProps(['totalBPs', 'spentBPs'])

	const higherTickNumber = computed(() => { return props.totalBPs > props.spentBPs ? props.totalBPs : props.spentBPs })

	function comparedToTotal(bpToCompare) { return Math.sign(props.totalBPs - bpToCompare) }
</script>

<template>
  <div id="BattlePointSDisplay_Wrapper" class="calc_bp-info">
    <div class="calc_bp-info_wrapper">
      <TransitionGroup tag="ul" name="ticks" id="BattlePointsTicks" class="calc_bp-info_wrapper_list" data-difficulty="default">
        <BPTick
          v-for="(bpItem, bpIndex) in higherTickNumber"
          :key="bpIndex"
          :position="comparedToTotal(bpIndex+1)"
          :isTicked="bpItem <= props.spentBPs"
        />
      </TransitionGroup>
    </div>

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

  .ticks-enter-active,
  .ticks-leave-active {
    transition: all var(--tick-transition-duration) ease;
  }

  .ticks-enter-from,
  .ticks-leave-to {
    transform: scale(0);
    opacity: 0;
    // transform: translateY(30px);
  }

  // -- stagger
  // @mixin transition-delay($step) {
  //   transition-delay: ($step * 0.05s);
  // }
  // %local-ph-transition-common {
  //   transition: all 0.2s;
  // }
  //
  // .ticks-enter-active {
  //   transition-timing-function: ease-out;
  //   @extend %local-ph-transition-common;
  // }
  // .ticks-leave-active {
  //   transition-timing-function: ease-in;
  //   @extend %local-ph-transition-common;
  // }
  //
  // @for $i from 0 through 4 {
  //   .ticks-leave-active:nth-last-of-type(#{$i}) {
  //      @include transition-delay($i);
  //   }
  // }
  //
  // .ticks-enter-active {
  //   @include transition-delay(0);
  //
  //   & + .ticks-enter-active {
  //     @include transition-delay(1);
  //
  //     & + .ticks-enter-active {
  //       @include transition-delay(2);
  //
  //       & + .ticks-enter-active {
  //         @include transition-delay(3);
  //
  //       }
  //     }
  //   }
  // }
</style>
