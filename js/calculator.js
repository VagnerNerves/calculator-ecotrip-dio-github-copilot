/*
  js/calculator.js

  Global: Calculator

  Methods:
  - calculateEmissions(distanceKm, transportMode): returns emissions (kg CO2) rounded to 2 decimals
  - calculateAllModes(distanceKm): returns array with emission and percentage vs car for each mode
  - calculateSavings(emission, baselineEmission): returns object with savedKg and percentage vs baseline
  - calculateCarbonCredits(emissionKg): returns credits (emission / KG_PER_CREDIT) rounded to 4 decimals
  - estimateCreditPrice(credits): returns { min, max, average } rounded to 2 decimals

  Notes:
  - Uses CONFIG.EMISSION_FACTORS and CONFIG.CARBON_CREDIT defined in js/config.js
  - Functions perform basic validation and handle division-by-zero cases gracefully
*/

var Calculator = {
  // Calculate emissions in kg CO2 for a given distance (km) and transport mode
  // Calculation: emissions = distanceKm * emissionFactor
  // Result rounded to 2 decimal places
  calculateEmissions: function (distanceKm, transportMode) {
    if (typeof distanceKm !== "number" || isNaN(distanceKm)) return null;

    var factor = null;
    if (typeof CONFIG !== "undefined" && CONFIG.EMISSION_FACTORS) {
      factor = CONFIG.EMISSION_FACTORS[transportMode];
    }

    if (factor === undefined || factor === null || isNaN(factor)) return null;

    var emissions = distanceKm * factor; // basic multiplication
    return Math.round(emissions * 100) / 100; // round to 2 decimals
  },

  // For a distance, calculate emissions for all transport modes and compare vs car
  // Returns array of objects: { mode: 'car', emission: 12.5, percentageVsCar: 100 }
  // percentageVsCar = (emission / carEmission) * 100; if carEmission is 0 or unavailable, percentageVsCar is null
  calculateAllModes: function (distanceKm) {
    if (typeof distanceKm !== "number" || isNaN(distanceKm)) return [];

    var ef =
      typeof CONFIG !== "undefined" && CONFIG.EMISSION_FACTORS
        ? CONFIG.EMISSION_FACTORS
        : {};

    // baseline: car emissions
    var carEmission = this.calculateEmissions(distanceKm, "car");

    var results = [];
    for (var mode in ef) {
      if (!Object.prototype.hasOwnProperty.call(ef, mode)) continue;

      var emission = this.calculateEmissions(distanceKm, mode);
      var percentageVsCar = null;

      // If car baseline is available and non-zero, compute percentage vs car
      if (
        carEmission !== null &&
        typeof carEmission === "number" &&
        carEmission !== 0
      ) {
        percentageVsCar = (emission / carEmission) * 100; // compute raw percentage
        percentageVsCar = Math.round(percentageVsCar * 100) / 100; // round to 2 decimals
      } else if (carEmission === 0 && emission === 0) {
        // both zero: define as 100% (equivalent)
        percentageVsCar = 100;
      } else {
        // baseline missing or carEmission is zero while emission > 0 => undefined percentage
        percentageVsCar = null;
      }

      results.push({
        mode: mode,
        emission: emission,
        percentageVsCar: percentageVsCar,
      });
    }

    // Sort by emission ascending (lowest first)
    results.sort(function (a, b) {
      return a.emission - b.emission;
    });

    return results;
  },

  // Calculate how much is saved compared to a baseline emission
  // savedKg = baseline - emission
  // percentage = (savedKg / baseline) * 100
  // Returns { savedKg: 5.5, percentage: 45 } both rounded to 2 decimals; percentage null if baseline is 0
  calculateSavings: function (emission, baselineEmission) {
    if (typeof emission !== "number" || isNaN(emission)) return null;
    if (typeof baselineEmission !== "number" || isNaN(baselineEmission))
      return null;

    var saved = baselineEmission - emission;
    var savedKg = Math.round(saved * 100) / 100;

    var percentage = null;
    if (baselineEmission !== 0) {
      percentage = (saved / baselineEmission) * 100;
      percentage = Math.round(percentage * 100) / 100; // round to 2 decimals
    } else {
      percentage = null; // undefined when baseline is zero
    }

    return { savedKg: savedKg, percentage: percentage };
  },

  // Convert emission (kg) to carbon credits using CONFIG.CARBON_CREDIT.KG_PER_CREDIT
  // Returns credits rounded to 4 decimal places
  calculateCarbonCredits: function (emissionKg) {
    if (typeof emissionKg !== "number" || isNaN(emissionKg)) return null;
    var perCredit =
      typeof CONFIG !== "undefined" &&
      CONFIG.CARBON_CREDIT &&
      CONFIG.CARBON_CREDIT.KG_PER_CREDIT
        ? CONFIG.CARBON_CREDIT.KG_PER_CREDIT
        : 1000;

    var credits = emissionKg / perCredit;
    // use toFixed to get 4 decimal places then convert back to Number
    return Number(credits.toFixed(4));
  },

  // Estimate price range for given credits using CONFIG.CARBON_CREDIT PRICE_MIN_BRL and PRICE_MAX_BRL
  // Returns { min, max, average } rounded to 2 decimals
  estimateCreditPrice: function (credits) {
    if (typeof credits !== "number" || isNaN(credits)) return null;

    var minPrice =
      typeof CONFIG !== "undefined" &&
      CONFIG.CARBON_CREDIT &&
      CONFIG.CARBON_CREDIT.PRICE_MIN_BRL
        ? CONFIG.CARBON_CREDIT.PRICE_MIN_BRL
        : 0;
    var maxPrice =
      typeof CONFIG !== "undefined" &&
      CONFIG.CARBON_CREDIT &&
      CONFIG.CARBON_CREDIT.PRICE_MAX_BRL
        ? CONFIG.CARBON_CREDIT.PRICE_MAX_BRL
        : 0;

    var min = credits * minPrice;
    var max = credits * maxPrice;
    var average = (min + max) / 2;

    return {
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      average: Math.round(average * 100) / 100,
    };
  },
};

/* Example usage (console):

  Calculator.calculateEmissions(100, 'car'); // => 12.00
  Calculator.calculateAllModes(100);
  Calculator.calculateSavings(5, 12); // -> { savedKg: 7, percentage: 58.33 }
  Calculator.calculateCarbonCredits(1200); // -> 1.2000
  Calculator.estimateCreditPrice(1.2); // -> { min: 60, max: 180, average: 120 }

*/
