/*
  js/ui.js

  Global: UI

  Contém métodos utilitários e de renderização para a UI da aplicação.

  Notas:
  - Métodos de formatação usam locale 'pt-BR'.
  - Renderers retornam strings HTML completas que podem ser inseridas nos containers:
      #results-content, #comparison-content, #carbon-credits-content
  - O arquivo define apenas a variável global `UI`.
*/

var UI = {
  /* -------------------- UTILITY METHODS -------------------- */

  // Formata número com separador de milhares e casas decimais
  // Usa toLocaleString('pt-BR') para respeitar separadores e acentuação
  // number: Number, decimals: Number
  formatNumber: function (number, decimals) {
    if (typeof number !== "number" || isNaN(number)) return "";
    var opts = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    };
    return number.toLocaleString("pt-BR", opts);
  },

  // Formata valor em moeda brasileira (R$)
  // value: Number
  formatCurrency: function (value) {
    if (typeof value !== "number" || isNaN(value)) return "";
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  },

  // Remove a classe 'hidden' do elemento com id 'elementId'
  showElement: function (elementId) {
    var el = document.getElementById(elementId);
    if (!el) return;
    el.classList.remove("hidden");
  },

  // Adiciona a classe 'hidden' ao elemento com id 'elementId'
  hideElement: function (elementId) {
    var el = document.getElementById(elementId);
    if (!el) return;
    el.classList.add("hidden");
  },

  // Rolagem suave até o elemento com id 'elementId'
  scrollToElement: function (elementId) {
    var el = document.getElementById(elementId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  },

  /* -------------------- RENDERING METHODS -------------------- */

  // Renderiza os resultados principais (rota, distância, emissão, transporte e eventual economia)
  // data: { origin, destination, distance, emission, mode, savings }
  // Retorna string HTML completa
  renderResults: function (data) {
    // Obtem metadata do modo selecionado
    var modeMeta =
      typeof CONFIG !== "undefined" &&
      CONFIG.TRANSPORT_MODES &&
      CONFIG.TRANSPORT_MODES[data.mode]
        ? CONFIG.TRANSPORT_MODES[data.mode]
        : { label: data.mode, icon: "", color: "#666" };

    // Cards:
    // - Route card: origem -> destino
    // - Distance card: distância em km
    // - Emission card: kg CO2 com ícone de folha
    // - Transport card: ícone + label + cor
    // - Savings card: se disponível e modo != 'car'

    var routeCard =
      '<div class="results__card results__card--route">' +
      '<h3 class="results__card__title">Rota</h3>' +
      '<p class="results__card__text"><strong>' +
      (data.origin || "") +
      "</strong> → <strong>" +
      (data.destination || "") +
      "</strong></p>" +
      "</div>";

    var distanceText =
      typeof data.distance === "number" && !isNaN(data.distance)
        ? UI.formatNumber(data.distance, 0) + " km"
        : "-";
    var distanceCard =
      '<div class="results__card results__card--distance">' +
      '<h3 class="results__card__title">Distância</h3>' +
      '<p class="results__card__text">' +
      distanceText +
      "</p>" +
      "</div>";

    var emissionText =
      typeof data.emission === "number" && !isNaN(data.emission)
        ? UI.formatNumber(data.emission, 2) + " kg CO₂"
        : "-";
    var emissionCard =
      '<div class="results__card results__card--emission">' +
      '<h3 class="results__card__title">Emissão</h3>' +
      '<p class="results__card__text">🌿 <strong>' +
      emissionText +
      "</strong></p>" +
      "</div>";

    var transportCard =
      '<div class="results__card results__card--transport">' +
      '<h3 class="results__card__title">Transporte</h3>' +
      '<p class="results__card__text">' +
      (modeMeta.icon
        ? '<span class="results__transport-icon">' + modeMeta.icon + "</span> "
        : "") +
      '<span class="results__transport-label" style="color:' +
      modeMeta.color +
      '">' +
      (modeMeta.label || data.mode) +
      "</span></p>" +
      "</div>";

    var savingsCard = "";
    if (
      data.mode !== "car" &&
      data.savings &&
      typeof data.savings.savedKg === "number"
    ) {
      var saved = UI.formatNumber(data.savings.savedKg, 2);
      var pct =
        typeof data.savings.percentage === "number" &&
        data.savings.percentage !== null
          ? UI.formatNumber(data.savings.percentage, 2) + "%"
          : "-";
      savingsCard =
        '<div class="results__card results__card--savings">' +
        '<h3 class="results__card__title">Economia vs Carro</h3>' +
        '<p class="results__card__text">💚 <strong>' +
        saved +
        " kg</strong> (" +
        pct +
        ")</p>" +
        "</div>";
    }

    // Agrupa todos os cards em um container
    var html =
      '<div class="results__cards">' +
      routeCard +
      distanceCard +
      emissionCard +
      transportCard +
      savingsCard +
      "</div>";

    return html;
  },

  // Renderiza a comparação entre modos
  // modesArray: [{ mode, emission, percentageVsCar }]
  // selectedMode: string (e.g., 'car')
  // Retorna HTML completo
  renderComparison: function (modesArray, selectedMode) {
    if (!Array.isArray(modesArray)) return "";

    // Determina emissão máxima para referência da barra
    var maxEmission = modesArray.reduce(function (acc, cur) {
      return Math.max(acc, typeof cur.emission === "number" ? cur.emission : 0);
    }, 0);
    if (maxEmission === 0) maxEmission = 1; // evita divisão por zero

    var itemsHtml = modesArray
      .map(function (m) {
        var meta =
          typeof CONFIG !== "undefined" &&
          CONFIG.TRANSPORT_MODES &&
          CONFIG.TRANSPORT_MODES[m.mode]
            ? CONFIG.TRANSPORT_MODES[m.mode]
            : { label: m.mode, icon: "", color: "#666" };

        // classes
        var isSelected = m.mode === selectedMode;
        var itemClass =
          "comparison__item" +
          (isSelected ? " comparison__item--selected" : "");

        // header badge
        var badge = isSelected
          ? '<span class="comparison__badge">Selecionado</span>'
          : "";

        var emissionText =
          typeof m.emission === "number"
            ? UI.formatNumber(m.emission, 2) + " kg"
            : "-";
        var pctText =
          typeof m.percentageVsCar === "number" && m.percentageVsCar !== null
            ? UI.formatNumber(m.percentageVsCar, 2) + "%"
            : "-";

        // progress width based on emission / maxEmission
        var widthPct =
          typeof m.emission === "number"
            ? Math.round((m.emission / maxEmission) * 100)
            : 0;

        // color coding. Prefer percentage vs car when available, else use emission percent of maxEmission
        var colorRef =
          typeof m.percentageVsCar === "number" && m.percentageVsCar !== null
            ? m.percentageVsCar
            : widthPct;
        var barColor = "#16a34a"; // green default
        if (colorRef <= 25) barColor = "#16a34a"; // green
        else if (colorRef <= 75) barColor = "#f59e0b"; // yellow
        else if (colorRef <= 100) barColor = "#f97316"; // orange
        else barColor = "#ef4444"; // red (>100)

        var itemHtml =
          "" +
          '<div class="' +
          itemClass +
          '" data-mode="' +
          m.mode +
          '">' +
          '  <div class="comparison__header">' +
          '    <div class="comparison__icon">' +
          (meta.icon || "") +
          "</div>" +
          '    <div class="comparison__meta">' +
          '      <div class="comparison__label">' +
          (meta.label || m.mode) +
          "</div>" +
          '      <div class="comparison__stats">' +
          emissionText +
          " • " +
          pctText +
          "</div>" +
          "    </div>" +
          "    " +
          badge +
          "  </div>" +
          '  <div class="comparison__bar">' +
          '    <div class="comparison__bar-fill" style="width:' +
          widthPct +
          "%; background:" +
          barColor +
          '"></div>' +
          "  </div>" +
          "</div>";

        return itemHtml;
      })
      .join("\n");

    // Tip box
    var tip =
      '<div class="comparison__tip">💡 Dica: Compare modos para identificar opções mais eficientes e possíveis economias de emissão.</div>';

    return '<div class="comparison__list">' + itemsHtml + "</div>" + tip;
  },

  // Renderiza cartão de créditos de carbono
  // creditsData: { credits: Number, price: { min, max, average } }
  renderCarbonCredits: function (creditsData) {
    if (!creditsData) return "";

    var credits =
      typeof creditsData.credits === "number" ? creditsData.credits : 0;
    var price = creditsData.price || { min: 0, max: 0, average: 0 };

    var creditsText = UI.formatNumber(credits, 4);
    var priceAvg = UI.formatCurrency(price.average || 0);
    var priceRange =
      UI.formatCurrency(price.min || 0) +
      " — " +
      UI.formatCurrency(price.max || 0);

    var html =
      "" +
      '<div class="carbon-credits__grid">' +
      '  <div class="results__card carbon-credits__card carbon-credits__card--credits">' +
      '    <h3 class="results__card__title">Créditos necessários</h3>' +
      '    <p class="results__card__text"><strong class="carbon-credits__value">' +
      creditsText +
      "</strong></p>" +
      '    <p class="results__card__helper">1 crédito = ' +
      UI.formatNumber(
        typeof CONFIG !== "undefined" && CONFIG.CARBON_CREDIT
          ? CONFIG.CARBON_CREDIT.KG_PER_CREDIT
          : 1000,
        0
      ) +
      " kg CO₂</p>" +
      "  </div>" +
      '  <div class="results__card carbon-credits__card carbon-credits__card--price">' +
      '    <h3 class="results__card__title">Estimativa de preço</h3>' +
      '    <p class="results__card__text"><strong>' +
      priceAvg +
      "</strong></p>" +
      '    <p class="results__card__helper">Faixa: ' +
      priceRange +
      "</p>" +
      "  </div>" +
      "</div>" +
      '<div class="carbon-credits__info">' +
      "  <p>Os créditos de carbono representam uma forma de compensar emissões financiando projetos que reduzem ou removem CO₂ da atmosfera.</p>" +
      '  <button type="button" class="btn carbon-credits__btn">Compensar emissões</button>' +
      "</div>";

    return html;
  },

  // Mostra estado de loading em um botão: desabilita, salva texto original e coloca spinner
  // buttonElement: DOM element (button)
  showLoading: function (buttonElement) {
    if (!buttonElement) return;
    // Salva texto original
    buttonElement.dataset.originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML =
      '<span class="spinner" aria-hidden="true"></span> Calculando';
  },

  // Restaura o botão após loading
  hideLoading: function (buttonElement) {
    if (!buttonElement) return;
    buttonElement.disabled = false;
    if (buttonElement.dataset && buttonElement.dataset.originalText) {
      buttonElement.innerHTML = buttonElement.dataset.originalText;
    }
  },
};

/*
  Observações:
  - As strings HTML retornadas podem ser inseridas diretamente nos containers:
      document.getElementById('results-content').innerHTML = UI.renderResults(...)
  - As classes utilizadas seguem BEM e esperam algum CSS de suporte (ex.: .results__card, .comparison__item, .carbon-credits__grid)
*/
