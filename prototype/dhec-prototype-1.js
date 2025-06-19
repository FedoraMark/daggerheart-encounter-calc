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

    // -- page elements
    const $NumberOfPlayers = $('#number-of-players');
    const $DifficultyAdjustment = $('#difficulty-adjustment');
    const $TotalBPs = $('#totalBPs');
    const $BattlePointsTicks = $('#BattlePointsTicks');
    const $MonsterList = $('#MonsterList');

    // -- variables
    let currentDifficulty = DIFFICULTY_DEFAULT; // easy | default | hard
    let purchasedAdversaryArray = [];
    let totalTickedBPs = 0;

    // FUNCTIONS
    // -- text
    const pluralize = (number, singular, plural) => { return number === 1 ? singular : plural };

    // -- return
    const getNumberOfPlayers = () => { return $NumberOfPlayers.val() };

    const getDifficultyAdjustment = () => { return $DifficultyAdjustment.val() };

    const calculateDefaultBattlePoints = (numberOfPlayers) => { return ((3 * numberOfPlayers) + 2) };

    // -- calculate
    function changeNumberOfPlayers() {
        let numberOfPcs = getNumberOfPlayers();
        let newTotal = numberOfPcs;

        // sanitize number
        if (numberOfPcs === "e" || numberOfPcs.includes('e')) {
            newTotal = 2;
        } else {
            newTotal = Math.floor(newTotal);

            if (newTotal <= 0) {
                newTotal = 1;
            } else if (newTotal >= 11) {
                newTotal = 10;
            }
        }

        // use number
        $NumberOfPlayers.val(newTotal);
        updateBattlePointTotals(calculateDefaultBattlePoints(newTotal), getDifficultyAdjustment());
    }

    // -- paint
    function updateBattlePointTotals(totalBattlePoints, difficulty) {
        let totalBPs = totalBattlePoints;

        if (difficulty === DIFFICULTY_EASY) {
            totalBPs = totalBattlePoints + EASIER_OR_SHORTER;
        } else if (difficulty === DIFFICULTY_HARD) {
            totalBPs = totalBattlePoints + HARDER_OR_LONGER;
        }

        // paint ticks and update total
        $BattlePointsTicks.empty();
        for (var i = 0; i < totalBPs; i++) {
            $BattlePointsTicks.append(`<li class="calc_bp-info_list_tick bp-tick" data-is-ticked="false"></li>`);
        }
        $BattlePointsTicks.find(`li:nth-of-type(${totalBPs})`).addClass(`bp-level bp-${difficulty}`);
        $TotalBPs.html(totalBPs);

        // TODO: spent out of total (with overage warning)

        updateTicks();
    }

    function updateSpentBattlePoints() {
        purchasedAdversaryArray = []; // reset
        $MonsterList.find('li > input').each(function(mlIndex, mlElement) {
            const $mlElement = $(mlElement);
            for (var i = 0; i < $mlElement.val(); i++) {
                purchasedAdversaryArray.push($mlElement.data("adversary-name"));
            }
        });

        updateTicks();
    }

    function updateTicks() {
        totalTickedBPs = 0; // reset
        for (const purchasedAdversary of purchasedAdversaryArray) {
            totalTickedBPs += ADVERSARY_COSTS[purchasedAdversary];
        }

        checkAdjustmentConditions();

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
    }

    function checkAdjustmentConditions(totalSpentBPs) {
        // multiple solos
        // add damage
        // lower tier
        // no B, H, L, S
    }

    function createAdversaryOptions() {
        for (adversary in ADVERSARY_COSTS) {
            $MonsterList.append(`
                <li class="calc_lower_left_list_adversary">
                    <label for="adversary_${adversary}">${adversary}</label>
                    <input value="0" type="number" name="adversary_${adversary}" id="adversary_${adversary}" data-adversary-name="${adversary}" min="0">
                </li>
            `);
        }

        // TODO: minions text

        $MonsterList.find('li').on('change', function(event) { updateSpentBattlePoints() });
    }

    // -- listeners
    $NumberOfPlayers.on('change', function(event) { changeNumberOfPlayers(); });
    $DifficultyAdjustment.on('change', function(event) { changeNumberOfPlayers(); });

    // TODO: Reset / clear

    // ON LOAD
    createAdversaryOptions();
    changeNumberOfPlayers();
});