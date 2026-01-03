/*
  js/routes-data.js

  Global: RoutesDB

  Structure:
  - RoutesDB.routes -> Array of route objects: { origin: "City, ST", destination: "City, ST", distanceKm: Number }
  - RoutesDB.getAllCities() -> returns unique, alphabetically sorted array of city names (strings)
  - RoutesDB.findDistance(origin, destination) -> returns distance in km (Number) if a matching route is found (searches both directions), otherwise null

  Usage examples (run in browser console):
    RoutesDB.getAllCities();
    RoutesDB.findDistance('São Paulo, SP', 'Rio de Janeiro, RJ'); // -> 430

  OBS: This file declares a single global variable `RoutesDB` as requested.
*/

var RoutesDB = {
  routes: [
    {
      origin: "São Paulo, SP",
      destination: "Rio de Janeiro, RJ",
      distanceKm: 430,
    },
    { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1016 },
    {
      origin: "Rio de Janeiro, RJ",
      destination: "Brasília, DF",
      distanceKm: 1148,
    },
    { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },
    {
      origin: "Rio de Janeiro, RJ",
      destination: "Niterói, RJ",
      distanceKm: 13,
    },
    {
      origin: "Belo Horizonte, MG",
      destination: "Ouro Preto, MG",
      distanceKm: 100,
    },
    { origin: "Porto Alegre, RS", destination: "Pelotas, RS", distanceKm: 260 },
    {
      origin: "Porto Alegre, RS",
      destination: "Florianópolis, SC",
      distanceKm: 460,
    },
    {
      origin: "Florianópolis, SC",
      destination: "Curitiba, PR",
      distanceKm: 300,
    },
    { origin: "Curitiba, PR", destination: "São Paulo, SP", distanceKm: 408 },
    {
      origin: "Salvador, BA",
      destination: "Feira de Santana, BA",
      distanceKm: 110,
    },
    { origin: "Salvador, BA", destination: "Aracaju, SE", distanceKm: 330 },
    { origin: "Fortaleza, CE", destination: "Sobral, CE", distanceKm: 232 },
    { origin: "Recife, PE", destination: "Olinda, PE", distanceKm: 10 },
    { origin: "Recife, PE", destination: "João Pessoa, PB", distanceKm: 118 },
    { origin: "Natal, RN", destination: "Mossoró, RN", distanceKm: 283 },
    { origin: "Belém, PA", destination: "Santarém, PA", distanceKm: 640 },
    { origin: "Manaus, AM", destination: "Parintins, AM", distanceKm: 369 },
    { origin: "Cuiabá, MT", destination: "Várzea Grande, MT", distanceKm: 10 },
    {
      origin: "Campo Grande, MS",
      destination: "Dourados, MS",
      distanceKm: 237,
    },
    { origin: "Goiânia, GO", destination: "Anápolis, GO", distanceKm: 55 },
    { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 207 },
    { origin: "Vitória, ES", destination: "Vila Velha, ES", distanceKm: 16 },
    {
      origin: "Belo Horizonte, MG",
      destination: "Uberlândia, MG",
      distanceKm: 480,
    },
    { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 78 },
    {
      origin: "Rio de Janeiro, RJ",
      destination: "Petrópolis, RJ",
      distanceKm: 68,
    },
    { origin: "São Luís, MA", destination: "Imperatriz, MA", distanceKm: 630 },
    { origin: "Teresina, PI", destination: "Parnaíba, PI", distanceKm: 333 },
    { origin: "Maceió, AL", destination: "Arapiraca, AL", distanceKm: 125 },
    {
      origin: "João Pessoa, PB",
      destination: "Campina Grande, PB",
      distanceKm: 120,
    },
    { origin: "Natal, RN", destination: "Parnamirim, RN", distanceKm: 17 },
    { origin: "Aracaju, SE", destination: "Lagarto, SE", distanceKm: 85 },
    {
      origin: "Belo Horizonte, MG",
      destination: "Montes Claros, MG",
      distanceKm: 420,
    },
    {
      origin: "Rio Branco, AC",
      destination: "Cruzeiro do Sul, AC",
      distanceKm: 648,
    },
    {
      origin: "Porto Velho, RO",
      destination: "Guajará-Mirim, RO",
      distanceKm: 640,
    },
  ],

  // Return unique sorted array of all city names (from origin and destination)
  getAllCities: function () {
    var set = new Set();
    this.routes.forEach(function (r) {
      if (r && r.origin) set.add(r.origin);
      if (r && r.destination) set.add(r.destination);
    });
    // Convert to array and sort using localeCompare to respect accents
    return Array.from(set).sort(function (a, b) {
      return a.localeCompare(b, "pt-BR");
    });
  },

  // Find route distance (search both directions). Normalizes input (trim + lowercase)
  findDistance: function (origin, destination) {
    if (!origin || !destination) return null;
    var o = origin.trim().toLowerCase();
    var d = destination.trim().toLowerCase();

    for (var i = 0; i < this.routes.length; i++) {
      var r = this.routes[i];
      var ro = (r.origin || "").trim().toLowerCase();
      var rd = (r.destination || "").trim().toLowerCase();

      if ((ro === o && rd === d) || (ro === d && rd === o)) {
        return r.distanceKm;
      }
    }
    return null;
  },
};

/* Example quick checks (copy into console):

  RoutesDB.getAllCities();
  // -> ['Anápolis, GO', 'Aracaju, SE', ... ]

  RoutesDB.findDistance('São Paulo, SP', 'Rio de Janeiro, RJ');
  // -> 430

  RoutesDB.findDistance('rio de janeiro, rj', 'são paulo, sp');
  // -> 430 (search is case-insensitive and trims whitespace)

*/
