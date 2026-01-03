/*
  js/config.js

  Global: CONFIG

  - CONFIG.EMISSION_FACTORS: kg CO2 per KM
  - CONFIG.TRANSPORT_MODES: metadata for UI (label, icon, color)
  - CONFIG.CARBON_CREDIT: credit constants
  - CONFIG.populateDatalist(): populate <datalist id="cities-list"> using RoutesDB.getAllCities()
  - CONFIG.setupDistanceAutofill(): wire origin/destination inputs to auto-fill distance using RoutesDB.findDistance(); supports manual override via checkbox

  Usage examples (console):
    CONFIG.populateDatalist();
    CONFIG.setupDistanceAutofill();

  Note: This file defines a single global variable `CONFIG` as requested.
*/

var CONFIG = {
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96,
  },

  TRANSPORT_MODES: {
    bicycle: { label: "Bicicleta", icon: "🚲", color: "#10b981" },
    car: { label: "Carro", icon: "🚗", color: "#2563eb" },
    bus: { label: "Ônibus", icon: "🚌", color: "#f59e0b" },
    truck: { label: "Caminhão", icon: "🚚", color: "#ef4444" },
  },

  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_BRL: 50,
    PRICE_MAX_BRL: 150,
  },

  // Popula o datalist com id "cities-list" usando RoutesDB.getAllCities()
  populateDatalist: function () {
    try {
      var datalist = document.getElementById("cities-list");
      if (!datalist) return;

      // Limpa itens existentes
      datalist.innerHTML = "";

      var cities = [];
      if (typeof RoutesDB !== "undefined" && RoutesDB.getAllCities) {
        cities = RoutesDB.getAllCities();
      }

      cities.forEach(function (city) {
        var opt = document.createElement("option");
        opt.value = city;
        datalist.appendChild(opt);
      });
    } catch (err) {
      // fail silently; not critical
      console.warn("CONFIG.populateDatalist error:", err);
    }
  },

  // Configura o preenchimento automático de distância com base nas inputs de origem/destino
  setupDistanceAutofill: function () {
    var originEl = document.getElementById("origin");
    var destinationEl = document.getElementById("destination");
    var distanceEl = document.getElementById("distance");
    var manualCheckbox = document.getElementById("distance-manual");

    if (!originEl || !destinationEl || !distanceEl || !manualCheckbox) return;

    // Helper paragraph: prefer procurar pelo seletor, fallback para nextElementSibling
    var helper = null;
    var parentFld = distanceEl.closest("fieldset");
    if (parentFld) {
      helper = parentFld.querySelector(".calculator__helper");
    }
    if (!helper) helper = distanceEl.nextElementSibling || null;

    var defaultHelperText = helper ? helper.textContent : "";

    function setHelper(text, color) {
      if (!helper) return;
      helper.textContent = text;
      if (color) helper.style.color = color;
      else helper.style.color = "";
    }

    function tryAutofillDistance() {
      // if manual mode is enabled, respect manual entry
      if (manualCheckbox.checked) {
        distanceEl.readOnly = false;
        setHelper("Digite a distância (km) manualmente.");
        return;
      }

      var o = originEl.value.trim();
      var d = destinationEl.value.trim();

      if (!o || !d) {
        distanceEl.value = "";
        distanceEl.readOnly = true;
        setHelper(defaultHelperText, "");
        return;
      }

      var dist = null;
      if (typeof RoutesDB !== "undefined" && RoutesDB.findDistance) {
        dist = RoutesDB.findDistance(o, d);
      }

      if (dist !== null && dist !== undefined) {
        distanceEl.value = dist;
        distanceEl.readOnly = true;
        setHelper("Distância encontrada automaticamente.", "var(--primary)");
      } else {
        distanceEl.value = "";
        distanceEl.readOnly = true;
        setHelper(
          'Distância não encontrada — marque "Inserir distância manualmente" para digitar.',
          "#b45309"
        );
      }
    }

    // event listeners
    originEl.addEventListener("change", tryAutofillDistance);
    destinationEl.addEventListener("change", tryAutofillDistance);

    manualCheckbox.addEventListener("change", function () {
      if (manualCheckbox.checked) {
        distanceEl.readOnly = false;
        setHelper("Digite a distância (km) manualmente.", "");
      } else {
        // try to autofill again
        tryAutofillDistance();
      }
    });

    // Try once on setup
    tryAutofillDistance();
  },
};

// Inicializa automaticamente quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  CONFIG.populateDatalist();
  CONFIG.setupDistanceAutofill();
});
