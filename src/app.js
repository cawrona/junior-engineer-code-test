/**
 * Prompt: Implement a function that validates that the input Vehicles
 * have the expected minimum @param expectedYear and total cost is
 * @param expectedCost. Do not include vehicles with type `Trailer` in
 * either of these calculations.
 * You can assume the following shape of Vehicles below and that all
 * numbers will be sensible integers.
 * interface Vehicle {
 *   type: 'Truck' | 'Trailer' | 'Tractor'
 *   year: number
 *   value: number
 * }
 *
 * @param {Vehicle[]} input
 * @param {number} expectedCost The expected sum cost of all vehicles passed in
 * @param {number} expectedOldestYear The expected minimum year of all vehicles passed in
 * @return {boolean} A boolean indicating whether input matches expected{Cost,Year}
 */
/*
 Note: I made this validator following the prompt as closely as possible. Two assumptions were provided by the prompt:
 1. The vehicle shape will be { type: 'Truck' | 'Trailer' | 'Tractor', year: number, value: number }
 2. All numbers will be sensible integers

 In other words, we can assume that @param input will be valid.
*/
 function isValid (input, expectedCost, expectedOldestYear) {
    let totalCost = 0;
    for (const vehicle of input) {
        if (vehicle.type === 'Truck' || vehicle.type === 'Tractor') {       // if type == trailer, skip calculations
            if (vehicle.year >= expectedOldestYear) {                       // clarification needed: does min vehicle.year==expectedOldestYear? this would change a few things
                totalCost += vehicle.value;
            }
            else {
                return false;
            }
        }
    }
    return totalCost === expectedCost;                                      // year was already checked. so if this is true, valid is true.
}


/**
 * Prompt: Implement a few tests to validate that your function works as expected
 */
function testIsValid () {
    let passed = true;
    const vehicleA = { type: 'Truck', year: 2000, value: 1200 };
    const vehicleB = { type: 'Truck', year: 2022, value: 35000 };
    const vehicleC = { type: 'Tractor', year: 2021, value: 5000 };
    const vehicleD = { type: 'Tractor', year: 2015, value: 900 };
    const vehicleE = { type: 'Trailer', year: 1998, value: 1300 };
    const vehicleF = { type: 'Trailer', year: 2000, value: 8000 };

    const set1 = [vehicleA, vehicleB, vehicleC, vehicleE];    // minYr = 2000, totalValue = 41200
    const set2 = [vehicleB, vehicleD, vehicleF];    // minYr = 2015, totalValue = 35900
    const set3 = [vehicleE, vehicleF];              // minYr = 0, totalValue = 9300 (0 expectedCost)

    // Test 1 - testing with valid input
    if (isValid(set1, 41200, 2000)) {
        console.log('TEST 1: PASS');
    }
    else {
        passed = false;
        console.log('TEST 1: FAIL - Check type, value and year calculations');
    }

    // Test 2 - different input, still valid
    if (isValid(set2, 35900, 2015)) {
        console.log('TEST 2: PASS');
    }
    else {
        passed = false;
        console.log('TEST 2: FAIL - Check type, value and year calculations');
    }

    // Test 3 - checking expectedCost != totalCost
    if (!(isValid(set1, 9999999, 0))) {
        console.log('TEST 3: PASS');
    }
    else {
        passed = false;
        console.log('TEST 3: FAIL - Check that total value of Vehicle[] == expectedCost');
    }

    // Test 4 - checking minYear < expectedOldestYear
    if (!(isValid(set1, 41200, 99999))) {
        console.log('TEST 4: PASS');
    }
    else {
        passed = false;
        console.log('TEST 4: FAIL - Check that vehicle.year >= expectedOldestYear');
    }

    // Test 5 - checking a Vehicle[] of only trailers
    if (isValid(set3, 0, 999999)) {
        console.log('TEST 5: PASS');
    }
    else {
        passed = false;
        console.log('TEST 5: FAIL - Check that vehicle.type "Trailer" bypasses year/cost calculations');
    }

    //All passed?
    if (passed) {
        console.log('All tests passed. OK!');
    }
}

testIsValid();
