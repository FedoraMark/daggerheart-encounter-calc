<script setup>
    import { ref, computed } from 'vue'

    import BattlePointsDisplay from './BattlePointsDisplay.vue'
    import AdversariesList from './AdversariesList.vue'
    import Formula from './Formula.vue'

    const numberOfPlayers = ref(4);
    const spentTotal = ref (0);

    const formulaTotal = computed(() => { return ((3 * numberOfPlayers.value) + 2) })
    const adjustmentsTotal = computed(() => { return 0 })
    const finalTotal = computed(() => { return (formulaTotal.value + adjustmentsTotal.value) })
</script>

<template>
     <section id="CalculatorSection" class="calc">
        <div class="calc_upper">
            <div class="calc_upper_player-info">
                <label for="number-of-players">Number of PCs:</label>
                <input :value="numberOfPlayers" type="number" name="number-of-players" id="number-of-players" min="1" max="9">
            </div>

            <div class="calc_upper_difficulty">
                <label for="difficulty-adjustment">Difficulty:</label>
                <select name="difficulty-adjustment" id="difficulty-adjustment">
                    <option value="easy">Easy/Short (-1)</option>
                    <option value="default" selected>Normal</option>
                    <option value="hard">Hard/Long (+2)</option>
                </select>
            </div>
        </div>

        <hr />

        <BattlePointsDisplay :totalBPs="finalTotal" :spentBPs="spentTotal" />

        <hr />

        <div class="calc_lower">
            <div class="calc_lower_right">
                <Formula :numPCs="numberOfPlayers" :formulaBPs="formulaTotal" />

                <div class="calc_lower_right_adjustments">
                    <h3>Adjustments</h3>
                    <ul id="AdjustmentList" class="calc_lower_right_adjustments_list">
                        <li id="adj-difficulty">Difficulty change</li>
                        <li id="adj-multiSolo">Multiple Solo adversaries</li>
                        <li id="adj-lackingBHLS">No Bruisers, Hordes,<br />Leaders, or Solos</li>
                    </ul>
                </div>

                <div class="calc_lower_right_options">
                    <h3>Options</h3>
                    <ul id="OptionsList" class="calc_lower_right_options_list">
                        <li id="opt-addedDmg" tabindex="-1">
                            <label for="toggle-addedDmg">Add +1d4 (or static +2) to all<br />adversaries' damage rolls</label>
                        </li>
                        <li id="opt-lowerTier" tabindex="-1">
                            <label for="toggle-lowerTier">Choose at least one adversary<br />from a lower tier</label>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="calc_lower_left">
                <AdversariesList :numPCs="numberOfPlayers" />
            </div>
        </div>

        <div id="Attribution">
            <p>This product includes materials from the Daggerheart System Reference Document 1.0, © Critical Role, LLC. under the terms of the Darrington Press Community Gaming (DPCGL) License. More information can be found at <a href="https://www.daggerheart.com">https://www.daggerheart.com</a>. There are no previous modifications by others.</p>
        </div>
    </section>
</template>

<style lang="scss">
    @use "../assets/tools/utilities" as utils;

    @use "../sass/RightColumn";

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

    .calc {
        * {
            outline-color: utils.$color-orange-dark;
        }

        hr {
            margin: 1.5rem 0;

            border-style: solid;
            border-color: utils.$color-orange-mid;

            visibility: hidden;
        }

        &_upper {
            @include utils.flex(center, center, 1rem 2rem, row wrap);

            &_player-info,
            &_difficulty {
                @include utils.flex(center, flex-start, 0.75rem);

                label {
                    @extend %label-common;
                }

                input {
                    padding: 3px;

                    font-weight: 700;
                    font-size: 1.5rem;
                    text-align: center;
                }

                select {
                    padding: 6px 3px 3px;

                    font-weight: 600;
                    font-size: 1.5rem;
                }
            }
        }


        &_lower {
            --gap-margin: 3rem;
            //
            @include utils.grid(var(--gap-margin), auto / repeat(2, 50%));
            //
            @include utils.respond-to-mobile {
                grid-template-columns: 100%;
            }

            &_left,
            &_right {
                grid-row-start: 1;

                @include utils.respond-to-mobile {

                }
            }

            &_left {
                grid-column-start: 1;
            }

            &_right {
                grid-column-start: 2;

                @extend %ph-calc-lower-common;
            }
        }

        #Attribution {
            flex-grow: 1;

            font-weight: 300;
            font-size: 0.85rem;

            @include utils.flex(flex-start, flex-end, 0, column);

            &,
            p {
                width: 100%;
            }

            p {
                padding: 3rem 0 0;
                margin: 0;

                opacity: 0.75;

                a {
                    text-decoration: underline;

                    &:is(:hover, :focus) {
                        text-decoration: none;
                    }
                }
            }
        }
    }
</style>