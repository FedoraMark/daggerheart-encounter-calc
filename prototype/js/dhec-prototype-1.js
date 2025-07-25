/* ASSUMES:
 *  - jQuery
 *
 */

$(function() {
    // VARS
    const DIFFICULTY_EASY = "easy";
    const DIFFICULTY_DEFAULT = "default";
    const DIFFICULTY_HARD = "hard";

    // -- battle point adjustments
    const EASIER_OR_SHORTER = -1;
    const MULTIPLE_SOLOS = -2;
    const ADDED_1D4_DAMAGE = -2;
    const CONTAINS_LOWER_TIER = +1;
    const NO_BRUISERS_HORDES_LEADERS_SOLOS = +1;
    const HARDER_OR_LONGER = +2;

    // -- adversary costs
    const ADVERSARY_COSTS = {
        minions: 1, // multiple up to number of PCs
        // ---
        social: 1,
        support: 1,
        // ---
        horde: 2,
        ranged: 2,
        skulk: 2,
        standard: 2,
        // ---
        leader: 3,
        // ---
        bruiser: 4,
        // ---
        solo: 5
    };

    const BHLS_LIST = ['bruiser', 'horde', 'leader', 'solo'];

    const DATA_IS_ACTIVE = 'data-is-active';

    // -- page elements
    const $NumberOfPlayers = $('#number-of-players');
    const $DifficultyAdjustment = $('#difficulty-adjustment');
    const $SpentBPs = $('#spentBPs');
    const $TotalBPs = $('#totalBPs');
    const $BattlePointsTicks = $('#BattlePointsTicks');
    const $MonsterList = $('#MonsterList');
    const $calcLowerRight = $('.calc_lower_right');
    const $FormulaList = $calcLowerRight.find('#FormulaList');
    const $AdjustmentList = $calcLowerRight.find('#AdjustmentList');
    const $OptionsList = $calcLowerRight.find('#OptionsList');
    const $ClearAdversaries = $('#ClearAdversaries');

    // -- variables
    let totalPlayers = 0;
    let currentDifficulty = DIFFICULTY_DEFAULT; // easy | default | hard
    let adjustmentTotal = 0;
    let purchasedAdversaryArray = [];
    let totalAvailableBPs = 0;
    let totalTickedBPs = 0;
    const minPlayers = 1;
    const maxPlayers = $NumberOfPlayers.attr("max");

    // FUNCTIONS
    // -- text
    const pluralize = (number, singular, plural) => { return number === 1 ? singular : plural };

    // -- return
    const getNumberOfPlayers = () => { return $NumberOfPlayers.val() };

    const calculateDefaultBattlePoints = () => { return ((3 * totalPlayers) + 2) };

    const adjustSign = (number) => { return new Intl.NumberFormat("en-US", { signDisplay: "exceptZero" }).format(number).replace('-', '&minus;').replace('+', '&plus;') }; // en dash

    const paintAdjustmentText = (adjustmentValue, otherClasses = '') => { return `<span class="adjustment-text ${otherClasses}" data-adjustment-value="${adjustmentValue}">${adjustSign(adjustmentValue)}</span>` };

    const paintOptionCheckbox = (checkboxIdName) => {return `<input type="checkbox" class="option-checkbox" id="${checkboxIdName}" name="${checkboxIdName}">` };

    const containsAny = (arr1, arr2) => { return arr1.some(item => arr2.includes(item)) };

    // -- calculate
    function updateNumberOfPlayers() {
        currentDifficulty = $DifficultyAdjustment.val();

        let numberOfPcs = getNumberOfPlayers();
        let newTotal = numberOfPcs;

        // sanitize number
        // if (numberOfPcs === "e" || numberOfPcs.includes('e')) {
        //     newTotal = 2;
        // }

        newTotal = Math.floor(newTotal);

        if (newTotal <= (minPlayers - 1)) {
            newTotal = minPlayers;
        } else if (newTotal >= (maxPlayers + 1)) {
            newTotal = maxPlayers;
        }

        // use number
        totalPlayers = newTotal
        $NumberOfPlayers.val(totalPlayers);

        updateFormulaAndAdjustmentsAndOptions();
        updateBattlePointTotals();
    }

    // -- paint
    // calculate the current total BPs
    function updateBattlePointTotals() {
        totalAvailableBPs = calculateDefaultBattlePoints() + adjustmentTotal;

        if (currentDifficulty === DIFFICULTY_EASY) {
            totalAvailableBPs = totalAvailableBPs + EASIER_OR_SHORTER;
        } else if (currentDifficulty === DIFFICULTY_HARD) {
            totalAvailableBPs = totalAvailableBPs + HARDER_OR_LONGER;
        }

        // paint ticks and update total
        $BattlePointsTicks.empty();
        for (var i = 0; i < totalAvailableBPs; i++) {
            $BattlePointsTicks.append(`<li class="calc_bp-info_list_tick bp-tick" data-is-ticked="false"></li>`);
        }
        $BattlePointsTicks.find(`li:nth-of-type(${totalAvailableBPs})`).addClass(`bp-level bp-${currentDifficulty}`);
        $TotalBPs.html(totalAvailableBPs);

        updateTicks();
    }

    // calculate the current spent BPs
    function calculateSpentBattlePoints() {
        purchasedAdversaryArray = []; // reset
        $MonsterList.find('li > input').each(function(mlIndex, mlElement) {
            const $mlElement = $(mlElement);
            for (var i = 0; i < $mlElement.val(); i++) {
                purchasedAdversaryArray.push($mlElement.data("adversary-name"));
            }
        });

        updateFormulaAndAdjustmentsAndOptions();
        updateBattlePointTotals();
    }

    // fill in ticks
    function updateTicks() {
        totalTickedBPs = 0; // reset
        for (const purchasedAdversary of purchasedAdversaryArray) {
            totalTickedBPs += ADVERSARY_COSTS[purchasedAdversary];
        }

        // if total spent > allowed BPS
        let numberOfTickBoxes = $BattlePointsTicks.find("li").length;
        if (totalTickedBPs > numberOfTickBoxes) {
            for (var i = numberOfTickBoxes; i < totalTickedBPs; i++) {
                $BattlePointsTicks.append(`<li class="calc_bp-info_list_tick bp-tick bp-overage" data-is-ticked="false"></li>`);
            }
        }

        // fill in ticks
        $BattlePointsTicks.find("li").each(function(bptIndex, bptElement) {
            $(bptElement).attr("data-is-ticked", (bptIndex < totalTickedBPs));
        });

        // cleanup
        $BattlePointsTicks.find("li").filter('.bp-overage[data-is-ticked="false"]').remove();

        updateSpentNumber();
    }

    function updateFormulaAndAdjustmentsAndOptions(totalSpentBPs) {
        // FORMULA
        // -- formula
        $FormulaList.find('#frm-formula #frm-pcs').html(totalPlayers);
        $FormulaList.find('#frm-formula #frm-total').html(calculateDefaultBattlePoints());

        // ADJUSTMENTS
        // -- difficulty +/-
        $AdjustmentList.find('#adj-difficulty').attr('data-current-difficulty', currentDifficulty);

        // -- multiple solos
        $AdjustmentList.find('#adj-multiSolo').attr(DATA_IS_ACTIVE, purchasedAdversaryArray.filter(((adv) => adv === "solo")).length > 1);

        // -- no B, H, L, S
        $AdjustmentList.find('#adj-lackingBHLS').attr(DATA_IS_ACTIVE, !containsAny(purchasedAdversaryArray, BHLS_LIST));

        // OPTIONS
        // -- add damage
        let $addedDamageCheckbox = $OptionsList.find('#opt-addedDmg .option-checkbox');
        $OptionsList.find('#opt-addedDmg').attr(DATA_IS_ACTIVE, $addedDamageCheckbox.is(":checked"));

        // -- lower tier
        let $lowerTierCheckbox = $OptionsList.find('#opt-lowerTier .option-checkbox');
        $OptionsList.find('#opt-lowerTier').attr(DATA_IS_ACTIVE, $lowerTierCheckbox.is(":checked"));

        // CALCULATE ADJUSTMENTS
        adjustmentTotal = 0; // reset
        const $activeAdjustmentList = $.merge($AdjustmentList, $OptionsList).find(`[${DATA_IS_ACTIVE}="true"]`);
        $activeAdjustmentList.each(function(aalIndex, aalElement) {
            adjustmentTotal += $(aalElement).find('.adjustment-text').data("adjustment-value");
        });
    }

    function updateSpentNumber() {
        $SpentBPs
            .html(totalTickedBPs)
            .attr('data-current-difficulty', currentDifficulty)
            .attr('data-spent-total-compare', (totalAvailableBPs - totalTickedBPs));
    }

    function resetAdversaries() {
        $MonsterList.find('input').val("0");
        calculateSpentBattlePoints();
    }

    // -- create items
    function createAdversaryOptions() {
        for (adversary in ADVERSARY_COSTS) {
            const cost = ADVERSARY_COSTS[adversary];
            $MonsterList.append(`
                <li class="calc_lower_left_list_adversary">
                    <label for="adversary_${adversary}"><span class="adv-name">${adversary}</span><span class="adv-bp"><strong>${cost}</strong> ${pluralize(cost, "BP", "BPs")}</span></label>
                    <input value="0" type="number" name="adversary_${adversary}" id="adversary_${adversary}" data-adversary-name="${adversary}" min="0">
                </li>
            `);
        }
    }

    function createAdjustmentText() {
        // $FormulaList.find('#frm-formula')
        //     .append(paintAdjustmentText(calculateDefaultBattlePoints(), "frm-total"));

        $AdjustmentList.find('#adj-difficulty')
            .append(paintAdjustmentText(EASIER_OR_SHORTER, 'adj-easy'))
            .append(paintAdjustmentText(HARDER_OR_LONGER, 'adj-hard'));
        $AdjustmentList.find('#adj-multiSolo')
            .append(paintAdjustmentText(MULTIPLE_SOLOS));
        $AdjustmentList.find('#adj-lackingBHLS')
            .append(paintAdjustmentText(NO_BRUISERS_HORDES_LEADERS_SOLOS));

        $OptionsList.find('#opt-addedDmg')
            .prepend(paintOptionCheckbox("toggle-addedDmg"))
            .append(paintAdjustmentText(ADDED_1D4_DAMAGE));
        $OptionsList.find('#opt-lowerTier')
            .prepend(paintOptionCheckbox("toggle-lowerTier"))
            .append(paintAdjustmentText(CONTAINS_LOWER_TIER));
    }

    // INIT
    createAdversaryOptions();
    createAdjustmentText();

    // -- listeners
    $NumberOfPlayers.on('change', function(event) { updateNumberOfPlayers(); });
    $DifficultyAdjustment.on('change', function(event) { updateNumberOfPlayers(); });
    $MonsterList.find('li').on('change', function(event) { calculateSpentBattlePoints(); });
    $OptionsList.find('input[type="checkbox"]').on('change', function(event) { updateNumberOfPlayers(); });
    $ClearAdversaries.on('click', function(event) { resetAdversaries(); });

    // -- initial
    updateNumberOfPlayers();
});