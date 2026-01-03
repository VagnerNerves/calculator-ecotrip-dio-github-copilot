<p align="center">
  
  <h1 align="center">Project Calculator Ecotrip</h1>
  
  This project was developed with GitHub Copilot using commands from the DIO course **"GitHub Copilot - Código na Prática"**. It estimates CO₂ emissions for trips based on route distances and transportation modes. Use this small web demo to explore carbon footprint calculations and basic UI integrations.
</p>

## 🧭 Table of contents

- [🧭 Table of contents](#-table-of-contents)
- [💬 Comandos Github Copilot](#-comandos-github-copilot)
  - [1. Initial command to create html](#1-initial-command-to-create-html)
  - [2. Create css](#2-create-css)
  - [3. Create routes](#3-create-routes)
  - [4. Crete config](#4-crete-config)
  - [5. Create Logic Calculate](#5-create-logic-calculate)
  - [6. Create interations with UI](#6-create-interations-with-ui)
  - [7. Create app js for clicks on UI](#7-create-app-js-for-clicks-on-ui)
- [💡 Technologies Used](#-technologies-used)
- [🚀 Running the Project](#-running-the-project)
  - [Front-end Web](#front-end-web)
- [✒ Author](#-author)

## 💬 Comandos Github Copilot

Following are the commands used to create and scaffold this project. Paste your commands in the code blocks below.

### 1. Initial command to create html

```bash
Create a sematica HTML5 Structure for a CO² emissions calculator:

HEADER:
Title with leaf emoji: "Calculador de Emissão CO²".
Subtitule explaining the purpose.


MAIN FORM (id="calculator-form"):
- Origin input (id="origin") with datalist (id="cities-list") for autocomplete
- Destination input (id="destination") sharing the same datalist
- Distance input (id="distance", type="number", readonly) that will be auto-filled.
- Checkbox (id="distance") labeled "Inserir distância manualmente"
- Transport mode selector with 4 radio buttons in a bisual grid:
   - bicycle, car (checked), bus, truck
   - Each wrapped in label with emoji icon and text in Portuguese
   - use name="transport" an values: bicycle, car, bus, truck
- Submit button with text "Calculator Emissão"

RESULTS SECTIONS (all hidden by default with class="hidden"):
- Section id="results" with empty div id="results-content"
- Section id "comparison" with empty div id="comparison-content"
- Section id="carbon-credits" with empty div id="carbon-credits-content"

FOOTER:
- Credits Text: "Desenvolvido com amor para a DIO | Projeto Hithub Copilot do Vagner Nerves"

AT THE END OG BODY (in this order):
- Script tags loading JavaScript files in order:
   <script src="js/routes-data.js"></script>
   <script src="js/config.js"></script>
   <script src="js/calculator.js"></script>
   <script src="js/ui.js"></script>
   <script src="js/app.js"></script>

REQUIREMENTS:
- Use BEM naming convention for classes
- Include meta viewport for responsive design
- Link to css/style.css in head
- The datalist should be empty initially (will be populated by JavaScript)
- Add helper text below distance input: "A distância será preenchida automaticamente"
```

### 2. Create css

```bash
Create a morden CSS file (css/style.css) with:

CSS CUSTOM PROPERTIERS at :root level:
- Eco-friendly color palette:
    - --primary: #10b981, --secondary: #059669, --accent: #34d399
    - --danger: #ef2937, --warning: #f5e0b, --info: #3b8216
    - --text: #1f2937, --text-light: #6b7280, --bg: #f3f416, --white: #ffffff
  - Spacing scale: --spacing-xs through --spacing-xl (0.5rem to 3rem)
  - --radius: 0.5rem, --readius-lg: 1rem
  - --shadow-sm, --shadow-md, --shadow-lg

  BASE STYLES:
  - Universal selector reset (margin, padding, box-sizing: border-box)
  - Body With gradient backeground: linear-gradiente(135deg, #d4fc79 0%, #96e6a1 100%)
  - Body min-height: 100vh, font-family: system fonts
  - Container class: max-width 1200px, centered with margin auto, padding

  UTILITY CLASSES:
  - .hidden { display: none !important; }
  - .section-title: large heading style

  HEADER:
  - white background, shadow, padding
  - Title with primary color, 2rem font size
  - subtitle in gray, smaller font

  FORMS STYLING (.calculator class):
  - white card background, rounded corners, shadow, padding
  - Form groups with margin-bottom
  - Labels: bold, display block, margin-bottom
  - Text/number inputs: full width, padding, border with focus state (primary color border and shadow)
  - Helper text: small, gray, below inputs

  TRANSPORT MODE GRID:
  - Container: display grid, 4 columns on desktop (1 on mobile), gap
  - Hide actual radio inputs with: position absolute, opacity 0
  - style the label as clickable card:
     * Border, padding, rounded corners, cursor pointer, text-align center
     * Display flex column for icon (3rem emoji) and label text
     * Hover: lift with transform translateY (-2px) and shadow
     * when input checked: primary border (2px), light primary background
     * Use adjacent sibling selector: input:checkerd + .card-class

CHECKBOX:
- Standar checkbox with label, margin top

BUTOON:
- Full with, primary backgroudn, white text, padding, rounded
- Hover: secondary color, lift effect
- Disabled: gray background, not-allowed cursor

Add .spinner class for loading animation:
- inline-block, 40px circle, border with rotating top color
- @keyframes spin animation

RESPONSIVE:
- Use min-width: 768px media query for desktop adjustments
- Transport grid: 4 columns on desktop, 2 on mobile (max-width: 767px)
```

### 3. Create routes

```bash
Create js/routes-data.js with a global named RoutesDB containing:

A property 'routes' as an array of route object with structure:
- origin: string (city name with state, e. g., "São Paulo, SP")
- destination: string (city name with state)
- distanceKm: number (actual distance between cities)

Include 30-40popular Brazillian routes:
- Capital to capital connections (São Paulo-Rio de Janeirop: 430km, São Paulo-Brasília: 1016km, Rio-Brasília: 1148km, etc...)
- Major regional routes (São Paulo-Campinas: 95km, Rio-Niterói: 13km, Belo Horizonte-Ouro Preto: 100km, etc...)
- Cover diferent regions of Brazil

Add these methods to RoutesDB object:

getAllCities: function() {
	// Return unique sorted array of all city names from routes
	// Extract from both origin and destination
	// Remove duplicates and sort alphabetically
}

findDistance: function(origin, destination) {
	// Find route distance between two cities
	// Search in both direction (origin-destination and destination-origin)
	// Normalize input: trim whitespace and convet to lowercase for comparison
	// return distance in km if found, null if not found
}

The entire file should one global variable: RoutesDB
Add commands explaining the structure
```

### 4. Crete config

```bash
Create js/config.js that defines a global CONFIG object with:

EMISSION_FACTORS object (kg CO2 per KM):
- bicycle: 0
- car: 0.12
- bus: 0.089
- truck: 0.96

TRANSPORT_MODES object with metadata:
For each mode (bicycle, car, bus, truck):
- label: Portugues name (Bicicletas, Carro, Ônibus, Caminhão)
- icon: emoji
- color hex color code for UI

CARBON_CREDIT object:
- KG_PER_CREDIT: 1000
- PRICE_MIN_BRL: 50
- PRICE_MAX_BRL: 150

Add a method to CONFIG called:

populateDatalist: function() {
	// Get cities list from RoutesDB.getAllCities()
	// Get datalist elemest by id "cities-list"
	// Create option elements for each city
	// Append to datalist
}

Also add:

setupDistanceAutofill: function() {
	// Get origin and destination input elements
	// Get distance input and manual checkbox
	// Add 'change' event listement to both origin and destination inputs
	// On Change:
		- Get trimmed values from both inputs
		- If both are filled, call RoutesDB.findDistance()
		- If distance found:
			- Fill distance input with value
			- Make it readonly
			- Show success message (change helper text color to green)
		- If not found:
			- Clear distance input
			- change helper text to suggest manual input
	// Add 'change' listener to manual checkbox:
		- When checked: remove readonly from distance, allow manual entry
		- whe unchecked: try to find route again
}

Everything should be in one globl CONFIG object
```

### 5. Create Logic Calculate

```bash
Create js/calculator.js with a global Calculator object containin these methods:

calculateEmissions: function(distanceKm, transportMode) {
	// Get emission factor from CONFIG.EMISSION_FACTORS using transportMode as key
	// Calculate: distance * factor
	// Return result rounded to 2 decimal places
}

calculateAllModes: function(distanceKm) {
	// Create array to store results
	// For each transport mode in CONFIG.EMISSION_FACTORS:
		- Calculate emission for that mode
		- Calculate car emission as baseline
		- Calculate percentage vs car: (emission / carEmission) * 100
		- Pusha object to array: { mode: 'car', emission: 12.5, percentageVsCar: 100 }
	// Sort array by emission (lowest first)
	// Return Array
}

calculateSavings: function(emission, baselineEmission) {
	// Calculate save kg: baseline - emission
	// Calculate percentage: (saved / baseline) * 100
	// Return object: { savedKg: 5.5, percentage: 45 }
	// Round numbers to 2 decimals
}

calculateCarbonCredits: function(emissionKg) {
	// Divide emission by CONFIG.CARBON_CREDIT.KG_PER_CREDIT
	// Return rounded to 4 decimal places
}

estimateCreditPrice: function(credits) {
	// Calculate min: credits * PRICE_MIN_BRL
	// Calculate max: credits * PRICE_MAX_BRL
	// Calculate average: (min + max) / 2
	// Return object: { min: 50.5, max: 150.5, average: 100.5 }
	// Round to 2 decimals
}

Add comments explaining each calculation
The filke defines one global variable: Calculator
```

### 6. Create interations with UI

```bash
Create js/ui.js with a global UI object containing:

UTILITY METHODS:

formatNumber: function(number, decimals) {
	// Use toFidex() for decimals
	// Add thousand separators using regex or toLocaleString('pt-BR')
	// Return Formatted string
}

formatCurrency: function(value) {
	// Format as R$ with pt-BR locale
	// Return "R$ 1.234,56" format
}

showElement: function(elementId) {
	// Get element by ID
	// Remove 'hidden' class
}

hideElement: function(elementId) {
	// Get element by ID
	// Add 'hidden' class
}

scrollToElement: function(elementId) {
	// Get element by ID
	// Use scrollIntoView with smooth behavior
}

RENDERING METHODS:

renderResults: function(data) {
	// data object contains: origin, destination, distance, emission, mode, savings
	// Get mode metada from CONFIG.TRANSPORT_MODES
	// Create HTML string with template literals containing:
		- Route card showing origin -> destination
		- Distance car shoing distance in km
		- Emission card showing CO2 in kg with green leaf icon
		- Transport card showing mode icon and label
		- if mode is not 'car' and savings exist: savings card showing kg saved and percentage
	// Return complet HTML string
	// Use div with class="results__card" for each card
	// Use BEM naming for internal elements
}

renderComparison: function(modesArray, selectedMode) {
	// modesArray from Calculador.calculateAllModes
	// Create HTML string for each mode:
		- Container div with class = "comparison__item"
		- if mode === selectedMode, add class="comparison__item--selected"
		- Header with mode icone, label, and emission stats
		- if selected, add badge with "Selecionado" text
		- stats showing emission and percentage vs car
		- Progess bar with width based on emission (use max emission for 100% reference)
		- Color-code bar: green (0-25%), yellow (25-75%), orange (75-100%), red (>100%)
	// At the end, add tip box with helpful message
	// Return complete HTML string
}

renderCarbonCredits: function(creditsData) {
	// creditsData contains: { credits, price: {min, max, average} }
	// Create HTML string with:
		- Grid with 2 cards
		- Card 1: Credits needed (large number), helper text "1 crédito = 1000kb CO²"
		- Card 2: Estimated price (average), range showing min-max
		- Info box explaining what carbon credits are
		- Nutton "Compensar emissões" (can be non-functional for demo)
	// Return complete HTMl string
	// Use formatNumber and formatCurrency for values
}

showLoading: function(buttonElement) {
	// Save original text in data attribute: buttonElement.dataset.oritinalText
	// Disable button
	// Change innerHTML to show spinner and "Calculando" text
	// Spinner: '<span clar="spinner"></span> Calculando'
}

hideLoading: function(buttonElement) {
	// Enable button
	// Restore original text from data attribute
}

All methids should be part of the global UI object
Use clear comments explianing the HTML structure
```

### 7. Create app js for clicks on UI

```bash
Create js/app.js with initialization and event handling:

Create an immediately invoked function expression (IIFE) or use DOMContentLoaded event:

INITIALIZATION (when DOM is ready):
1. Call CONFIG.populateDatalist() to fill city autocomplete
2. Call CONFIG.setupDistanceAutofill() to enable auto-ditance feature
3. Get form element by id 'calculator-form'
4. Add submit event listener to form
5. Log to console: "Calculadora inicializada!"

FORM SUBMIT Handler:
When form submits:
1. Prevent default form submission (e.preventDefault())
2. Get all form values:
	- origin value (trim whitespace)
	- destination value (trim whitespace)
	- distance value (parse as float)
	- transport mode (get checked radio button value)
3. validate inputs:
	- Check if origin, destination, distance and filled
	- Check if distance is greater than 0
	- if validation fails: show alert with error message and return
4. Get submit button element
5. Call UI.showLoading(button) to show loading state
6. Hide previous results sections using UI.hideElement()
7. Use setTimeout with 1500ms delay to simulate processing:
	inside timeout:
		- Try-catch block for error handling:
			* Calculate emission for selected mode using Calculator
			* Calculate car emission as baseline
			* Calculate savings compared to car
			* Calculate all modes comparison
			* Calculate carbon credits and price estimate
			* Build data objects for rending
			* Call UI.renderResults() and set innerHTML of results-content
			* Call UI.renderComparison() and set innerHTML of comparison-content
			* Call Ui.renderCarbonCredits() and set innerHTML of carbon-credits-content
			* Show all three sections using UI.showElement()
			* Scroll to results section using UI.scrollToElement()
			* Call UI.hideLoading(button)
		- Catch any errors:
			* Log error to console
			* Show user-friendly alert
			* Call UI.hideLoading(button)

Add comments explaining each step
Use descriptive variable names
Keep code clean and readable
```

## 💡 Technologies Used

- [x] HTML5
- [x] CSS
- [x] Javascript

## 🚀 Running the Project

### Front-end Web

Clone the project

```bash
  git clone https://github.com/VagnerNerves/calculator-ecotrip-dio-github-copilot.git
```

Enter the project directory

```bash
  cd calculator-ecotrip-dio-github-copilot
```

Double-click on index.html

## ✒ Author

<p align="center">
  <img width="200px" alt="Author Vagner Nerves" title="Author Vagner Nerves" src="https://github.com/VagnerNerves/default-readme/blob/main/assets/VagnerNerves.svg" />

  <h3 align="center">Vagner Nerves</h3>
  
  <p align="center">  
    Made with love and hate 😅, get in touch!
  </p>
</p>  
  
<div align="center">

[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-1f6feb?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/vagnernervessantos/)](https://www.linkedin.com/in/vagnernervessantos/)
[![Gmail Badge](https://img.shields.io/badge/-vagnernervessantos@gmail.com-1f6feb?style=flat-square&logo=Gmail&logoColor=white&link=mailto:vagnernervessantos@gmail.com)](mailto:vagnernervessantos@gmail.com)
[![GitHub Badge](https://img.shields.io/badge/-GitHub-1f6feb?style=flat-square&logo=GitHub&logoColor=white&link=https://github.com/VagnerNerves)](https://github.com/VagnerNerves)

</div>
