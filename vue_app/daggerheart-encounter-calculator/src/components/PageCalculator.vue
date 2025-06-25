<script setup>

</script>

<template>
    <section id="CalculatorSection" class="calc">
        tbd
    </section>
</template>

<style lang="scss" scoped>
   @use "../assets/tools/utilities.scss" as utils;

    #CalculatorSection {
        flex-grow: 1;

        max-width: 39rem;
        padding: 2rem;
        margin: 0 auto;

        @include utils.flex(stretch, flex-start, 0, column nowrap);
        //
        @include utils.respond-to-mobile {
            padding: 2rem 1rem;
        }
    }
</style>