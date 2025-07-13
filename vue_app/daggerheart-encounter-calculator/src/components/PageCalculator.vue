<script setup>
    import { ref, computed } from 'vue'

    // components
    import NumberOfPlayersInput from './NumberOfPlayersInput.vue'
    import BattlePointsDisplay from './BattlePointsDisplay.vue'
    import AdversariesList from './AdversariesList.vue'
    import Formula from './Formula.vue'
    import Difficulty from './Difficulty.vue'
    import Option from './Option.vue'
    import Adjustment from './Adjustment.vue'

    // consts
    const OPTION = "option"
    const ADJUSTMENT = "adjustment"
    const DEFAULT_NUMBER_OF_PLAYERS = 4
    const DEFAULT_DIFFICULTY = 0

    // refs
    const currentNumberOfPlayers = ref(DEFAULT_NUMBER_OF_PLAYERS)
    const currentDifficulty = ref(DEFAULT_DIFFICULTY)
    const currentSpentTotal = ref(0)

    // -- flags
    const optionsObject = ref({
        // options
        "added_damage": {
            "type": OPTION,
            "modifier": -2,
            "active": false,
            "text": "Add +1d4 (or static +2) to all adversaries' damage rolls"
        },
        "lower_tier": {
            "type": OPTION,
            "modifier": 1,
            "active": false,
            "text": "Choose at least one adversary from a lower tier"
        }
    })
    const adjustmentsObject = ref({
        "multiple_solos": {
            "type": ADJUSTMENT,
            "modifier": -2,
            "active": false,
            "text": "Multiple Solo adversaries"
        },
        "no_bhls": {
            "type": ADJUSTMENT,
            "modifier": 1,
            "active": true, // default TRUE
            "text": "No Bruisers, Hordes, Leaders, or Solos"
        }
    })

    // computeds
    const formulaTotal = computed(() => { return ((3 * currentNumberOfPlayers.value) + 2) }) // 3n+2
    const adjustmentsTotal = computed(() => { return currentDifficulty.value + getModifiersTotal() })
    const finalTotal = computed(() => { return (formulaTotal.value + adjustmentsTotal.value) })

    // functions
    function getModifiersTotal() {
        let modifiersTotalBPs = 0

        for(const modifierObject of [optionsObject.value, adjustmentsObject.value]) {
            for (const [adjKey, adjObj] of Object.entries(modifierObject)) {
                if (adjObj.active) {
                    modifiersTotalBPs += adjObj.modifier
                }
            }
        }

        return modifiersTotalBPs
    }
</script>

<template>
     <section id="CalculatorSection" class="calc">
        <NumberOfPlayersInput v-model="currentNumberOfPlayers" />

        <BattlePointsDisplay :totalBPs="finalTotal" :spentBPs="currentSpentTotal" />

        <hr />

        <div class="calc_lower">
            <div class="calc_lower_right">
                <Formula
                    :numPCs="currentNumberOfPlayers"
                    :formulaBPs="formulaTotal"
                />

                <Difficulty
                    :currentDifficulty="currentDifficulty"
                    @set-difficulty="(diff) => { currentDifficulty = diff }"
                />

                <div class="options">
                    <h3>Options</h3>
                    <ul id="OptionsList" class="options_list">
                        <template v-for="(optionObject, optionKey) in optionsObject" :key="optionKey">
                            <Option
                                v-if="optionObject.type === OPTION"
                                :id="optionKey"
                                :text="optionObject.text"
                                :modifier="optionObject.modifier"
                                :isActive="optionObject.active"
                                @toggle-option-by-id="(id) => { optionsObject[id].active = !optionsObject[id].active }"
                            />
                        </template>
                    </ul>
                </div>

                <div class="adjustments">
                    <h3>Adjustments</h3>
                    <ul id="AdjustmentsList" class="adjustments_list">
                        <template v-for="(adjustmentObject, adjustmentKey) in adjustmentsObject" :key="adjustmentKey">
                            <Adjustment
                                v-if="adjustmentObject.type === ADJUSTMENT"
                                :id="adjustmentKey"
                                :text="adjustmentObject.text"
                                :modifier="adjustmentObject.modifier"
                                :isActive="adjustmentObject.active"
                            />
                        </template>
                    </ul>
                </div>
            </div>

            <div class="calc_lower_left">
                <AdversariesList
                    :numPCs="currentNumberOfPlayers"
                    :spentBPs="currentSpentTotal"
                    @update-adjustments="(bps, activateSoloAdj, activateBhlsAdj) => {
                        currentSpentTotal = bps;
                        adjustmentsObject.multiple_solos.active = activateSoloAdj;
                        adjustmentsObject.no_bhls.active = activateBhlsAdj;
                    }"
                />
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

        &_lower {
            @include utils.grid(var(--gap-margin-col), auto / repeat(2, 1fr));
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