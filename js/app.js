/*
  js/app.js

  Initialization and event handling for the calculator app.
  - Initializes CONFIG and UI features on DOMContentLoaded
  - Handles form submission, performs calculations via Calculator and RoutesDB,
    and updates the UI using UI.render* helpers

  The file defines a single IIFE that runs when DOM is ready.
*/

(function () {
  // Initialize when DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    // 1) Fill datalist with cities
    if (typeof CONFIG !== "undefined" && CONFIG.populateDatalist) {
      CONFIG.populateDatalist();
    }

    // 2) Setup auto-fill for distance
    if (typeof CONFIG !== "undefined" && CONFIG.setupDistanceAutofill) {
      CONFIG.setupDistanceAutofill();
    }

    // 3) Get the form element
    var form = document.getElementById("calculator-form");
    if (!form) {
      console.warn("Formulário não encontrado: #calculator-form");
      return;
    }

    // 4) Attach submit event handler
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent normal form submission

      // Get form values
      var originInput = document.getElementById("origin");
      var destinationInput = document.getElementById("destination");
      var distanceInput = document.getElementById("distance");
      var transportSelected = form.querySelector(
        'input[name="transport"]:checked'
      );

      var origin = originInput ? originInput.value.trim() : "";
      var destination = destinationInput ? destinationInput.value.trim() : "";
      var distance = distanceInput ? parseFloat(distanceInput.value) : NaN;
      var mode = transportSelected ? transportSelected.value : null;

      // Basic validation
      if (!origin || !destination) {
        window.alert("Por favor, preencha origem e destino.");
        return;
      }

      if (!distance || isNaN(distance) || distance <= 0) {
        window.alert("Por favor, insira uma distância válida (> 0 km).");
        return;
      }

      if (!mode) {
        window.alert("Por favor, selecione o modo de transporte.");
        return;
      }

      // Get submit button to show loading state
      var submitButton =
        form.querySelector('button[type="submit"]') ||
        form.querySelector(".calculator__submit");

      // Show loading UI
      UI.showLoading(submitButton);

      // Hide previous results
      UI.hideElement("results");
      UI.hideElement("comparison");
      UI.hideElement("carbon-credits");

      // Simulate processing time
      setTimeout(function () {
        try {
          // Calculate emissions for selected mode
          var emission = Calculator.calculateEmissions(distance, mode);

          // Baseline: car emissions
          var carEmission = Calculator.calculateEmissions(distance, "car");

          // Calculate savings vs car
          var savings = Calculator.calculateSavings(emission, carEmission);

          // Calculate comparison for all modes
          var modesComparison = Calculator.calculateAllModes(distance);

          // Carbon credits and pricing
          var credits = Calculator.calculateCarbonCredits(emission);
          var priceEstimate = Calculator.estimateCreditPrice(credits);

          // Build data objects for rendering
          var resultsData = {
            origin: origin,
            destination: destination,
            distance: distance,
            emission: emission,
            mode: mode,
            savings: savings,
          };

          var creditsData = {
            credits: credits,
            price: priceEstimate,
          };

          // Render and insert HTML
          var resultsContainer = document.getElementById("results-content");
          var comparisonContainer =
            document.getElementById("comparison-content");
          var creditsContainer = document.getElementById(
            "carbon-credits-content"
          );

          if (resultsContainer) {
            resultsContainer.innerHTML = UI.renderResults(resultsData);
          }

          if (comparisonContainer) {
            comparisonContainer.innerHTML = UI.renderComparison(
              modesComparison,
              mode
            );
          }

          if (creditsContainer) {
            creditsContainer.innerHTML = UI.renderCarbonCredits(creditsData);
          }

          // Show sections
          UI.showElement("results");
          UI.showElement("comparison");
          UI.showElement("carbon-credits");

          // Scroll to results for better UX
          UI.scrollToElement("results");

          // Restore button state
          UI.hideLoading(submitButton);
        } catch (err) {
          console.error("Erro ao processar cálculo:", err);
          window.alert("Ocorreu um erro ao calcular. Tente novamente.");
          UI.hideLoading(submitButton);
        }
      }, 1500);
    });

    // 5) Log initialization
    console.info("Calculadora inicializada!");
  });
})();
