export type Unit = {
  name: string;
  symbol: string;
  value: (x: number) => number;
}

export type UnitConverter = { [key: string]: Unit };

export type UnitType = "mass" | "distance" | "volume" | "temperature" | "time" | "currency" | "speed" | "force" | "pressure" | "fuel economy";

export const Mass: UnitConverter = {
  // Metric
  "µg": { name: "microgram", symbol: "µg", value: () => 0.000001 },
  "microgram": { name: "microgram", symbol: "µg", value: () => 0.000001 },
  "ug": { name: "microgram", symbol: "ug", value: () => 0.000001 },

  "mg": { name: "milligram", symbol: "mg", value: () => 0.001 },
  "milligram": { name: "milligram", symbol: "mg", value: () => 0.001 },

  "cg": { name: "centigram", symbol: "cg", value: () => 0.01 },
  "centigram": { name: "centigram", symbol: "cg", value: () => 0.01 },

  "dg": { name: "decigram", symbol: "dg", value: () => 0.1 },
  "decigram": { name: "decigram", symbol: "dg", value: () => 0.1 },

  "g": { name: "gram", symbol: "g", value: () => 1 },
  "gram": { name: "gram", symbol: "g", value: () => 1 },

  "kg": { name: "kilogram", symbol: "kg", value: () => 1000 },
  "kilogram": { name: "kilogram", symbol: "kg", value: () => 1000 },

  "t": { name: "tonne (metric ton)", symbol: "t", value: () => 1_000_000 },
  "tonne": { name: "tonne (metric ton)", symbol: "t", value: () => 1_000_000 },
  "metric ton": { name: "tonne (metric ton)", symbol: "t", value: () => 1_000_000 },

  // Jewelry/precise
  "ct": { name: "carat", symbol: "ct", value: () => 0.2 },
  "carat": { name: "carat", symbol: "ct", value: () => 0.2 },

  // Imperial
  "oz": { name: "ounce", symbol: "oz", value: () => 28.349523125 },
  "ounce": { name: "ounce", symbol: "oz", value: () => 28.349523125 },

  "lb": { name: "pound", symbol: "lb", value: () => 453.59237 },
  "pound": { name: "pound", symbol: "lb", value: () => 453.59237 },

  "st": { name: "stone", symbol: "st", value: () => 6350.29318 },
  "stone": { name: "stone", symbol: "st", value: () => 6350.29318 },

  "us ton": { name: "short ton (US)", symbol: "US ton", value: () => 907_184.74 },
  "short ton": { name: "short ton (US)", symbol: "short ton", value: () => 907_184.74 },
  "tn": { name: "short ton (US)", symbol: "tn", value: () => 907_184.74 },
  "ton": { name: "short ton (US)", symbol: "tn", value: () => 907_184.74 },
};

export const Distance: UnitConverter = {
  // Metric
  "mm": { name: "millimetre", symbol: "mm", value: () => 0.001 },
  "millimetre": { name: "millimetre", symbol: "mm", value: () => 0.001 },
  "millimeter": { name: "millimetre", symbol: "mm", value: () => 0.001 },

  "cm": { name: "centimeter", symbol: "cm", value: () => 0.01 },
  "centimeter": { name: "centimetre", symbol: "cm", value: () => 0.01 },
  "centimetre": { name: "centimetre", symbol: "cm", value: () => 0.01 },

  "dm": { name: "decimetre", symbol: "dm", value: () => 0.1 },
  "decimeter": { name: "decimetre", symbol: "dm", value: () => 0.1 },
  "decimetre": { name: "decimetre", symbol: "dm", value: () => 0.1 },

  "m": { name: "metre", symbol: "m", value: () => 1 },
  "meter": { name: "metre", symbol: "m", value: () => 1 },
  "metre": { name: "metre", symbol: "m", value: () => 1 },

  "km": { name: "kilometre", symbol: "km", value: () => 1000 },
  "kilometer": { name: "kilometre", symbol: "km", value: () => 1000 },
  "kilometre": { name: "kilometre", symbol: "km", value: () => 1000 },

  // US Customary / Imperial
  "in": { name: "inch", symbol: "in", value: () => 0.0254 },
  "inch": { name: "inch", symbol: "in", value: () => 0.0254 },

  "ft": { name: "foot", symbol: "ft", value: () => 0.3048 },
  "foot": { name: "foot", symbol: "ft", value: () => 0.3048 },
  "feet": { name: "foot", symbol: "ft", value: () => 0.3048 },

  "yd": { name: "yard", symbol: "yd", value: () => 0.9144 },
  "yard": { name: "yard", symbol: "yd", value: () => 0.9144 },

  "mi": { name: "mile", symbol: "mi", value: () => 1609.344 },
  "mile": { name: "mile", symbol: "mi", value: () => 1609.344 },

  // Nautical
  "nmi": { name: "nautical mile", symbol: "nmi", value: () => 1852 },
  "nautical mile": { name: "nautical mile", symbol: "nmi", value: () => 1852 },

  // Furlong, chain, rod (traditional Imperial/US)
  "fur": { name: "furlong", symbol: "fur", value: () => 201.168 },
  "furlong": { name: "furlong", symbol: "fur", value: () => 201.168 },

  "ch": { name: "chain", symbol: "ch", value: () => 20.1168 },
  "chain": { name: "chain", symbol: "ch", value: () => 20.1168 },

  // League (maritime, traditional ~3 nautical miles)
  "league": { name: "league", symbol: "league", value: () => 5556 },
};


export const Volume: UnitConverter = {
  // ========= Metric (liquid) =========
  "ml": { name: "milliliter", symbol: "mL", value: () => 0.001 },
  "milliliter": { name: "milliliter", symbol: "mL", value: () => 0.001 },
  "millilitre": { name: "millilitre", symbol: "mL", value: () => 0.001 },

  "cl": { name: "centiliter", symbol: "cL", value: () => 0.01 },
  "centiliter": { name: "centiliter", symbol: "cL", value: () => 0.01 },
  "centilitre": { name: "centilitre", symbol: "cL", value: () => 0.01 },

  "dl": { name: "deciliter", symbol: "dL", value: () => 0.1 },
  "deciliter": { name: "deciliter", symbol: "dL", value: () => 0.1 },
  "decilitre": { name: "decilitre", symbol: "dL", value: () => 0.1 },

  "l": { name: "liter", symbol: "L", value: () => 1 },
  "liter": { name: "liter", symbol: "L", value: () => 1 },
  "litre": { name: "litre", symbol: "L", value: () => 1 },

  "hl": { name: "hectoliter", symbol: "hL", value: () => 100 },
  "hectoliter": { name: "hectoliter", symbol: "hL", value: () => 100 },
  "hectolitre": { name: "hectolitre", symbol: "hL", value: () => 100 },

  // ========= Metric (cubic) =========
  "mm3": { name: "cubic millimeter", symbol: "mm³", value: () => 0.000001 },
  "cubic millimeter": { name: "cubic millimeter", symbol: "mm³", value: () => 0.000001 },
  "cubic millimetre": { name: "cubic millimetre", symbol: "mm³", value: () => 0.000001 },

  "cm3": { name: "cubic centimeter", symbol: "cm³", value: () => 0.001 }, // = 1 mL
  "cubic centimeter": { name: "cubic centimeter", symbol: "cm³", value: () => 0.001 },
  "cubic centimetre": { name: "cubic centimetre", symbol: "cm³", value: () => 0.001 },
  "cc": { name: "cubic centimeter", symbol: "cm³", value: () => 0.001 },

  "dm3": { name: "cubic decimeter", symbol: "dm³", value: () => 1 }, // = 1 L
  "cubic decimeter": { name: "cubic decimeter", symbol: "dm³", value: () => 1 },
  "cubic decimetre": { name: "cubic decimetre", symbol: "dm³", value: () => 1 },

  "m3": { name: "cubic meter", symbol: "m³", value: () => 1000 }, // already present previously
  "cubic meter": { name: "cubic meter", symbol: "m³", value: () => 1000 },
  "cubic metre": { name: "cubic metre", symbol: "m³", value: () => 1000 },

  "km3": { name: "cubic kilometer", symbol: "km³", value: () => 1_000_000_000_000 },
  "cubic kilometer": { name: "cubic kilometer", symbol: "km³", value: () => 1_000_000_000_000 },
  "cubic kilometre": { name: "cubic kilometre", symbol: "km³", value: () => 1_000_000_000_000 },

  // ========= US Customary (liquid) =========
  "fl oz": { name: "US fluid ounce", symbol: "fl oz (US)", value: () => 0.030 },
  "fluid ounce": { name: "US fluid ounce", symbol: "fl oz (US)", value: () => 0.030 },

  "pt": { name: "US pint", symbol: "pt (US)", value: () => 0.473176473 },
  "us pint": { name: "US pint", symbol: "pt (US)", value: () => 0.473176473 },
  "pint": { name: "US pint", symbol: "pt (US)", value: () => 0.473176473 },

  "qt": { name: "US quart", symbol: "qt (US)", value: () => 0.946352946 },
  "us quart": { name: "US quart", symbol: "qt (US)", value: () => 0.946352946 },
  "quart": { name: "US quart", symbol: "qt (US)", value: () => 0.946352946 },

  "gal": { name: "US gallon", symbol: "gal (US)", value: () => 3.785411784 },
  "us gallon": { name: "US gallon", symbol: "gal (US)", value: () => 3.785411784 },
  "gallon": { name: "US gallon", symbol: "gal (US)", value: () => 3.785411784 },

  "bbl": { name: "US barrel (oil)", symbol: "bbl (US)", value: () => 158.987294928 },
  "barrel": { name: "US barrel (oil)", symbol: "bbl (US)", value: () => 158.987294928 },

  // ========= Imperial (UK liquid) =========
  "uk pt": { name: "Imperial pint", symbol: "pt (Imp)", value: () => 0.56826125 },
  "imp pt": { name: "Imperial pint", symbol: "pt (Imp)", value: () => 0.56826125 },
  "imperial pint": { name: "Imperial pint", symbol: "pt (Imp)", value: () => 0.56826125 },

  "uk gal": { name: "Imperial gallon", symbol: "gal (Imp)", value: () => 4.54609 },
  "imp gal": { name: "Imperial gallon", symbol: "gal (Imp)", value: () => 4.54609 },
  "imperial gallon": { name: "Imperial gallon", symbol: "gal (Imp)", value: () => 4.54609 },

  // ========= US/Imperial (cubic) =========
  "in3": { name: "cubic inch", symbol: "in³", value: () => 0.016387064 },       // exact
  "cubic inch": { name: "cubic inch", symbol: "in³", value: () => 0.016387064 },

  "ft3": { name: "cubic foot", symbol: "ft³", value: () => 28.316846592 },      // exact
  "cubic foot": { name: "cubic foot", symbol: "ft³", value: () => 28.316846592 },

  "yd3": { name: "cubic yard", symbol: "yd³", value: () => 764.554857984 },     // exact
  "cubic yard": { name: "cubic yard", symbol: "yd³", value: () => 764.554857984 },

  "metric cup": { name: "metric cup", symbol: "cup (metric)", value: () => 0.25 },

  // ------------------
  // US
  // ------------------
  "cup": { name: "US teaspoon", symbol: "tsp (US)", value: () => 0.24 },
  "us cup": { name: "US teaspoon", symbol: "tsp (US)", value: () => 0.24 },

  "tsp": { name: "US teaspoon", symbol: "tsp (US)", value: () => 0.005 },
  "teaspoon": { name: "US teaspoon", symbol: "tsp (US)", value: () => 0.005 },

  "tbsp": { name: "US tablespoon", symbol: "tbsp (US)", value: () => 0.015 },
  "tablespoon": { name: "US tablespoon", symbol: "tbsp (US)", value: () => 0.015 }
};


export const Time: { [key: string]: Unit } = {
  // Base
  "second": { name: "second", symbol: "s", value: () => 1 },
  "s": { name: "second", symbol: "s", value: () => 1 },

  // Metric multiples (SI)
  "millisecond": { name: "millisecond", symbol: "ms", value: () => 1e-3 },
  "ms": { name: "millisecond", symbol: "ms", value: () => 1e-3 },

  "microsecond": { name: "microsecond", symbol: "µs", value: () => 1e-6 },
  "µs": { name: "microsecond", symbol: "µs", value: () => 1e-6 },
  "us": { name: "microsecond", symbol: "µs", value: () => 1e-6 },

  "nanosecond": { name: "nanosecond", symbol: "ns", value: () => 1e-9 },
  "ns": { name: "nanosecond", symbol: "ns", value: () => 1e-9 },

  "minute": { name: "minute", symbol: "min", value: () => 60 },
  "min": { name: "minute", symbol: "min", value: () => 60 },

  "hour": { name: "hour", symbol: "h", value: () => 3600 },
  "h": { name: "hour", symbol: "h", value: () => 3600 },

  "day": { name: "day", symbol: "d", value: () => 86400 },
  "d": { name: "day", symbol: "d", value: () => 86400 },

  "week": { name: "week", symbol: "wk", value: () => 604800 },
  "wk": { name: "week", symbol: "wk", value: () => 604800 },

  // Calendar-based (approximations, since months/years vary)
  "month": { name: "month (avg)", symbol: "mo", value: () => 2629800 }, // 30.437 days (Julian year / 12)
  "mo": { name: "month (avg)", symbol: "mo", value: () => 2629800 },

  "year": { name: "year (Julian)", symbol: "yr", value: () => 31557600 }, // 365.25 days, used in astronomy
  "yr": { name: "year (Julian)", symbol: "yr", value: () => 31557600 },

  // Non-SI but used
  "fortnight": { name: "fortnight", symbol: "fn", value: () => 1209600 }, // 14 days
  "fn": { name: "fortnight", symbol: "fn", value: () => 1209600 },
};

export const Speed: { [key: string]: Unit } = {
  // Base
  "meter per second": { name: "meter per second", symbol: "m/s", value: () => 1 },
  "m/s": { name: "meter per second", symbol: "m/s", value: () => 1 },
  "mps": { name: "meter per second", symbol: "m/s", value: () => 1 },

  // Metric
  "kilometer per hour": { name: "kilometer per hour", symbol: "km/h", value: () => 1000 / 3600 }, // 0.277778
  "km/h": { name: "kilometer per hour", symbol: "km/h", value: () => 1000 / 3600 },
  "kph": { name: "kilometer per hour", symbol: "km/h", value: () => 1000 / 3600 },

  "centimeter per second": { name: "centimeter per second", symbol: "cm/s", value: () => 0.01 },
  "cm/s": { name: "centimeter per second", symbol: "cm/s", value: () => 0.01 },

  // Imperial / US customary
  "mile per hour": { name: "mile per hour", symbol: "mph", value: () => 1609.344 / 3600 }, // 0.44704
  "mph": { name: "mile per hour", symbol: "mph", value: () => 1609.344 / 3600 },
  "mi/h": { name: "mile per hour", symbol: "mph", value: () => 1609.344 / 3600 },

  "foot per second": { name: "foot per second", symbol: "ft/s", value: () => 0.3048 },
  "ft/s": { name: "foot per second", symbol: "ft/s", value: () => 0.3048 },

  // Nautical
  "knot": { name: "knot", symbol: "kn", value: () => 1852 / 3600 }, // 0.514444
  "kn": { name: "knot", symbol: "kn", value: () => 1852 / 3600 }
};

export const Force: { [key: string]: Unit } = {
  // Base
  "newton": { name: "newton", symbol: "N", value: () => 1 },
  "n": { name: "newton", symbol: "N", value: () => 1 },

  // Metric (kilogram-force, gram-force)
  "kilogram-force": { name: "kilogram-force", symbol: "kgf", value: () => 9.80665 },
  "kgf": { name: "kilogram-force", symbol: "kgf", value: () => 9.80665 },

  "gram-force": { name: "gram-force", symbol: "gf", value: () => 0.00980665 },
  "gf": { name: "gram-force", symbol: "gf", value: () => 0.00980665 },

  // Imperial / US customary
  "pound-force": { name: "pound-force", symbol: "lbf", value: () => 4.4482216152605 },
  "lbf": { name: "pound-force", symbol: "lbf", value: () => 4.4482216152605 },

  "ounce-force": { name: "ounce-force", symbol: "ozf", value: () => 0.2780139 },
  "ozf": { name: "ounce-force", symbol: "ozf", value: () => 0.2780139 },

  "ton-force": { name: "ton-force (short, US)", symbol: "tonf (US)", value: () => 8896.443230521 },
  "tonf": { name: "ton-force (short, US)", symbol: "tonf (US)", value: () => 8896.443230521 }
};

export const Pressure: { [key: string]: Unit } = {
  // SI / Metric
  "pascal": { name: "pascal", symbol: "Pa", value: () => 1 },
  "pa": { name: "pascal", symbol: "Pa", value: () => 1 },

  "kilopascal": { name: "kilopascal", symbol: "kPa", value: () => 1000 },
  "kpa": { name: "kilopascal", symbol: "kPa", value: () => 1000 },

  "megapascal": { name: "megapascal", symbol: "MPa", value: () => 1_000_000 },
  "mpa": { name: "megapascal", symbol: "MPa", value: () => 1_000_000 },

  "bar": { name: "bar", symbol: "bar", value: () => 100_000 }, // 10^5 Pa
  "millibar": { name: "millibar", symbol: "mbar", value: () => 100 },

  // Pounds per square inch
  "lbf/in2": { name: "pound per square inch", symbol: "psi", value: () => 6894.757293168 },
  "lbf per in2": { name: "pound per square inch", symbol: "psi", value: () => 6894.757293168 },
  "psi": { name: "pound per square inch", symbol: "psi", value: () => 6894.757293168 },

  // Pounds per square foot
  "lbf/ft2": { name: "pound per square foot", symbol: "psf", value: () => 47.880258 },
  "lbf per ft2": { name: "pound per square foot", symbol: "psf", value: () => 47.880258 },
  "psf": { name: "pound per square foot", symbol: "psf", value: () => 47.880258 },
};

export const FuelEconomy: UnitConverter = {
  // Metric: liters per 100 km
  "l per 100km": {
    name: "liters per 100 kilometers",
    symbol: "L/100km",
    value: () => 100_000 // will invert when converting
  },
  "liters per 100km": {
    name: "liters per 100 kilometers",
    symbol: "L/100km",
    value: () => 100_000 // will invert when converting
  },
  "litres per 100km": {
    name: "liters per 100 kilometers",
    symbol: "L/100km",
    value: () => 100_000 // will invert when converting
  },
  "l/100km": {
    name: "liters per 100 kilometers",
    symbol: "L/100km",
    value: () => 100_000
  },

  // US MPG (miles per US gallon)
  "us mpg": {
    name: "US miles per gallon",
    symbol: "mpg (US)",
    value: () => 1609.344 / 3.785411784 // meters per liter
  },
  "mpg": {
    name: "US miles per gallon",
    symbol: "mpg (US)",
    value: () => 1609.344 / 3.785411784 // meters per liter
  },

  // UK MPG (Imperial gallon)
  "uk mpg": {
    name: "UK miles per gallon",
    symbol: "mpg (UK)",
    value: () => 1609.344 / 4.54609 // meters per liter
  },
  "imp mpg": {
    name: "UK miles per gallon",
    symbol: "mpg (UK)",
    value: () => 1609.344 / 4.54609 // meters per liter
  },
  "imperial mpg": {
    name: "UK miles per gallon",
    symbol: "mpg (UK)",
    value: () => 1609.344 / 4.54609 // meters per liter
  }
};


export const Temperature: UnitConverter = {
  // Celsius
  "celsius": {
    name: "celsius",
    symbol: "C",
    value: (x) => (x) * 9/5 + 32
  },
  "c": {
    name: "celsius",
    symbol: "C",
    value: (x) => (x) * 9/5 + 32
  },

  // Fahrenheit
  "fahrenheit": {
    name: "fahrenheit",
    symbol: "F",
    value: (x) => (x - 32) * 5/9
  },
  "f": {
    name: "fahrenheit",
    symbol: "F",
    value: (x) => (x - 32) * 5/9
  }
};


export const currencies: { [key: string]: string } = {
  "AUD": "Australian Dollar",
  "BGN": "Bulgarian Lev",
  "BRL": "Brazilian Real",
  "CAD": "Canadian Dollar",
  "CHF": "Swiss Franc",
  "CNY": "Chinese Renminbi Yuan",
  "CZK": "Czech Koruna",
  "DKK": "Danish Krone",
  "EUR": "Euro",
  "GBP": "British Pound",
  "HKD": "Hong Kong Dollar",
  "HUF": "Hungarian Forint",
  "IDR": "Indonesian Rupiah",
  "ILS": "Israeli New Sheqel",
  "INR": "Indian Rupee",
  "ISK": "Icelandic Króna",
  "JPY": "Japanese Yen",
  "KRW": "South Korean Won",
  "MXN": "Mexican Peso",
  "MYR": "Malaysian Ringgit",
  "NOK": "Norwegian Krone",
  "NZD": "New Zealand Dollar",
  "PHP": "Philippine Peso",
  "PLN": "Polish Złoty",
  "RON": "Romanian Leu",
  "SEK": "Swedish Krona",
  "SGD": "Singapore Dollar",
  "THB": "Thai Baht",
  "TRY": "Turkish Lira",
  "USD": "United States Dollar",
  "ZAR": "South African Rand"
}
