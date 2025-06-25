<script setup>

</script>

<template>
     <section id="CalculatorSection" class="calc">
        <div class="calc_upper">
            <div class="calc_upper_player-info">
                <label for="number-of-players">Number of PCs:</label>
                <input value="4" type="number" name="number-of-players" id="number-of-players" min="1" max="9">
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

        <div class="calc_bp-info">
            <ul id="BattlePointsTicks" class="calc_bp-info_list" data-difficulty="default">
                <!-- filled with JS -->
            </ul>

            <div class="calc_bp-info_total">
                <span class="span-label">Total Battle Points:</span>
                <span class="calc_bp-info_total_text">
                    <span id="spentBPs" class="calc_bp-info_total_text_number" data-current-difficulty="default" data-spent-total-compare="0">
                        <!-- filled with js -->
                    </span>
                    <span class="calc_bp-info_total_text_slash">/</span>
                    <span id="totalBPs" class="calc_bp-info_total_text_number">
                        <!-- filled with JS -->
                    </span>
                </span>
            </div>
        </div>

        <hr />

        <div class="calc_lower">
            <div class="calc_lower_right">
                <div class="calc_lower_right_formula">
                    <h3>Formula</h3>
                    <ul id="FormulaList" class="calc_lower_right_formula_list">
                        <li id="frm-formula" data-is-always-active>(3 &#215; <span id="frm-pcs">0</span> PCs) + 2 BPs = <span id="frm-total" class="adjustment-text-static">0</span></li>
                    </ul>
                </div>

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
                <h3>Adversaries</h3>
                <ul id="MonsterList" class="calc_lower_left_list">
                    <!-- filled with JS -->
                </ul>
                <button id="ClearAdversaries">Clear</button>
            </div>
        </div>

        <div id="Attribution">
            <p>This product includes materials from the Daggerheart System Reference Document 1.0, © Critical Role, LLC. under the terms of the Darrington Press Community Gaming (DPCGL) License. More information can be found at <a href="https://www.daggerheart.com">https://www.daggerheart.com</a>. There are no previous modifications by others.</p>
        </div>
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

    .calc {
        * {
            outline-color: utils.$color-orange-dark;
        }

        hr {
            margin: 1.5rem 0;

            border-style: solid;
            border-color: utils.$color-orange-mid;

            opacity: 0;
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
                    padding: 6px 3px 3px;

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

        &_bp-info {
            &_list {
                --tick-width: 4rem;
                //
                @include utils.cleanList;
                @include utils.grid(0.7rem, auto-flow 1fr / repeat(auto-fit, minmax(var(--tick-width), 1fr)));

                &_tick {
                    height: 1.25rem;
                    min-width: var(--tick-width);

                    border: 3px solid currentColor;
                    border-radius: 4px;

                    background-color: #fff;

                    &.bp {
                        &-tick {
                            color: utils.$color-purple-mid;

                            &[data-is-ticked="true"] {
                                border-color: transparent;

                                background-color: currentColor;
                            }
                        }

                        // &-level {
                        //     border-width: 3px;
                        //
                        //     &[data-is-ticked="true"] {
                        //         margin: 1px;
                        //         border-width: 2px;
                        //     }
                        // }

                        &-easy {
                            color: utils.$color-orange-dark; //$color-yellow-mid;
                        }

                        &-default {
                            color: utils.$color-orange-dark; //$color-orange-mid;
                        }

                        &-hard {
                            color: utils.$color-orange-dark; //$color-orange-dark;
                        }

                        &-overage {
                            position: relative;

                            color: transparent;

                            background-color: transparent;

                            @include utils.flex;

                            &[data-is-ticked="true"] {
                                border-color: utils.$color-red-hard-line;

                                opacity: 0.8;
                                background: repeating-linear-gradient(-45deg, utils.$color-red-hard-fill, utils.$color-red-hard-fill 5px, utils.$color-red-hard-line 5px, utils.$color-red-hard-line 15px);
                                background-color: utils.$color-red-hard-line;
                            }
                        }
                    }
                }
            }

            &_total {
                margin-top: 1.25rem;

                @include utils.flex(center, center, 0.5rem);

                .span-label {
                    @extend %label-common;
                }

                &_text {
                    @include utils.flex($gap: 0.6rem);

                    &_slash {
                        margin-top: 2px;

                        font-size: 2rem;
                    }

                    &_number {
                        min-width: 2.6rem;
                        margin-top: 6px;
                        overflow: hidden;

                        font-size: 2rem;
                        text-overflow: ellipsis;

                        &:first-of-type {
                            font-weight: 700;
                            text-align: right;
                        }

                        &:last-of-type {
                            font-weight: 600;
                            text-align: left;
                        }
                    }

                    #spentBPs {
                        color: var(--current-difficulty-color);

                        & {
                            --current-difficulty-color: #{utils.$color-purple-mid};
                        }

                        &[data-spent-total-compare^="-"] {
                            --current-difficulty-color: #{utils.$color-red-hard-line};
                        }

                        &[data-spent-total-compare="0"] {
                            &[data-current-difficulty="#{utils.$EASY}"] {
                                --current-difficulty-color: #{utils.$color-orange-dark}; //#{utils.$color-yellow-mid};
                            }

                            &[data-current-difficulty="#{utils.$DEFAULT}"] {
                                --current-difficulty-color: #{utils.$color-orange-dark}; //#{utils.$color-orange-mid};
                            }

                            &[data-current-difficulty="#{utils.$HARD}"] {
                                --current-difficulty-color: #{utils.$color-orange-dark}; //#{utils.$color-orange-dark};
                            }
                        }
                    }

                    #totalBPs {
                        color: #{utils.$color-orange-dark};

                    }
                }
            }
        }

        &_lower {
            --gap-margin: 3rem;
            //
            @include utils.flex(flex-start, center, var(--gap-margin) 5rem, row-reverse wrap);
            //
            @include utils.respond-to-mobile {
                @include utils.flex(center, flex-start, var(--gap-margin), column nowrap);
            }

            &_left,
            &_right {
                h3 {
                    margin: 0 0 0.75rem;

                    font-weight: 600;
                    font-size: 1.75rem;
                    text-align: center;
                }
            }

            &_left {
                &_list {
                    @include utils.cleanList;

                    &_adversary {
                        margin-bottom: 0.5rem;

                        @include utils.flex(center, flex-start, 1rem);

                        label,
                        input {
                            font-size: 1.5rem;
                        }

                        label {
                            position: relative;

                            width: 11rem;
                            padding-top: 3px;

                            font-weight: 400;
                            text-transform: capitalize;

                            @include utils.flex(center, flex-start, 0.5rem);

                            .adv-name {
                                flex-grow: 1;
                            }

                            .adv-bp {
                                width: 2rem;

                                font-weight: 400;
                                font-size: 0.75rem;
                                white-space: nowrap;

                                &,
                                * {
                                    color: utils.$color-orange-dark;
                                }

                                strong {
                                    font-weight: 800;
                                }
                            }

                            &::after {
                                content: "\00D7"; // ×

                                height: 100%;
                                padding-top: 3px;

                                color: utils.$color-purple-dark;
                            }

                            &[for="adversary_minions"] {
                                &::before {
                                    content: "group up to # of PCs";

                                    position: absolute;
                                    bottom: -0.55rem;
                                    left: 1.25rem;

                                    font-size: 0.75rem;
                                    text-transform: none;

                                    opacity: 0.5;
                                }
                            }
                        }

                        input {
                            width: 3rem;
                            padding: 6px 5px 2px;
                        }
                    }
                }

                #ClearAdversaries {
                    cursor: pointer;

                    display: block;

                    padding: calc(0.25rem + 3px) 1rem 0.25rem;
                    margin: 1.5rem auto 0;

                    color: utils.$color-purple-dark;
                    font-weight: 500;
                    font-size: 0.9rem;
                    text-transform: uppercase;

                    border: 1px solid utils.$color-purple-dark;
                    border-radius: 4px;

                    background: #fff;

                    &:is(:hover, :focus-visible) {
                        border-color: utils.$color-orange-dark;

                        background-color: #eee;
                    }
                }
            }

            &_right {
                --opacity-off: 0.25;

                &_formula li,
                &_adjustments li,
                &_options li label {
                    opacity: var(--opacity-off);
                }

                &_formula,
                &_adjustments,
                &_options {
                    &:not(:last-of-type) {
                        margin-bottom: var(--gap-margin);
                    }

                    &_list {
                        font-size: 1.25rem;

                        @include utils.cleanList;
                        @include utils.flex(center, flex-start, 1rem, column nowrap);

                        & {
                            --adjustment-color: #{utils.$color-orange-dark}; //#{utils.$color-purple-mid};

                        }

                        li {
                            position: relative;

                            width: auto;

                            line-height: 1.1;
                            text-align: center;

                            .adjustment-text {
                                position: absolute;
                                left: calc(100% + 0.75rem);

                                opacity: 0;

                                &,
                                &-static {
                                    color: var(--adjustment-color);
                                    font-weight: 700;
                                    white-space: nowrap;
                                }
                            }

                            &[data-is-active="true"],
                            &[data-is-always-active] {
                                &,
                                .adjustment-text,
                                label {
                                    opacity: 1;
                                }
                            }

                            &#frm-formula {
                                #frm-pcs {
                                    display: inline-block;

                                    min-width: 0.8rem;

                                    color: var(--adjustment-color);
                                    font-weight: 600;
                                }
                            }

                            &:not(#frm-formula) {
                                @include utils.flex(center, flex-start);
                            }

                            &#adj-difficulty {
                                opacity: 1;

                                &[data-current-difficulty="#{utils.$DEFAULT}"] {

                                    opacity: var(--opacity-off);
                                }

                                &[data-current-difficulty="#{utils.$EASY}"] .adjustment-text.adj-easy,

                                &[data-current-difficulty="#{utils.$HARD}"] .adjustment-text.adj-hard {

                                    opacity: 1;
                                }
                            }

                            :is(label, input.option-checkbox) {
                                cursor: pointer;
                            }

                            .option-checkbox {
                                -webkit-appearance: none;
                                        appearance: none;

                                position: absolute;
                                right: calc(100% + 1.25rem);

                                margin: 0;
                                // outline: none;

                                background-color: #fff;

                                --check-color: #{utils.$color-yellow-mid};

                                --checkbox-color: #{utils.$color-yellow-mid};

                                @include utils.flex;

                                &::before,
                                &::after {
                                    position: absolute;

                                    display: block;

                                    @include utils.squareSize(1rem);
                                }

                                &::before {
                                    content: "";

                                    border: 2px solid var(--checkbox-color);

                                    background: #fff;
                                }

                                &::after {
                                    transform: scale(0.7);

                                    background-color: var(--check-color);
                                }

                                &:checked {
                                    & {
                                        --check-color: #{utils.$color-orange-mid};

                                        --checkbox-color: #{utils.$color-orange-mid};

                                    }

                                    &::after {
                                        content: "";
                                    }
                                }

                                &:is(:hover, :focus-visible) {
                                    --check-color: #{utils.$color-orange-dark};

                                    --checkbox-color: #{utils.$color-orange-dark};

                                }
                            }
                        }
                    }
                }
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