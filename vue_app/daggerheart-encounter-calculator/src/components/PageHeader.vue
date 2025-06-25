<script setup></script>

<template>
  <header>
    <h1>Daggerheart Encounter Calculator</h1>
    <h2>Prototype v2</h2>
  </header>
</template>

<style lang="scss" scoped>
    @use "../assets/tools/utilities.scss" as utils;

    header {
        @extend %header-footer-common;

        padding: 2rem;

        border-width: 0 0 0.5rem;

        h1,
        h2 {
            text-align: center;
        }

        h1 {
            margin: 0 0 0.25rem;

            font-weight: 700;
            font-size: 2.5rem;
        }

        h2 {
            margin: 0;

            font-weight: 500;
            font-size: 1.25rem;
        }
    }
</style>
