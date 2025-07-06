<script setup>
    const props = defineProps(['numPCs', 'formulaBPs'])
</script>

<template>
  <div id="Formula_Wrapper" class="formula">
    <h3>Formula</h3>
    <ul id="FormulaList" class="formula_list">
      <li id="frm-formula" class="formula_list_item">
        <span class="formula_list_item_wrapper">(3 &#215; <span id="frm-pcs">{{ props.numPCs }}</span> PCs) + 2 BPs = <span id="frm-total" class="adjustment-text-static">{{ props.formulaBPs }}</span></span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
    @use "../sass/Formula";
</style>
