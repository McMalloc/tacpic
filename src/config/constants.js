export const A4_MAX_ROWS_PER_PAGE = 28;
export const A4_MAX_CHARS_PER_ROW = 35;
export const A4_WIDTH = 210;
export const A4_HEIGHT = 297;
export const PAGE_NUMBER_BOTTOM = 4;
export const MAX_VALUE_FOR_ORDER = 20000;
export const SVG_MIME = "image/svg+xml";
export const SVG_A4_PX_WIDTH = 793.7;
export const TOOL_SENSIBILITY = 1;
export const SAFE_BORDER = 10;
export const CACHE_TIMEOUT = 0;
export const BACKUP_INTERVAL = 3000;
export const DB_DATE_FORMAT = "%YYYY-%MM-%DD %HH:%mm:%ss %z";

export const XL_SCREEN = "@media only screen and (min-width: 1200px)";
export const LG_SCREEN = "@media only screen and (min-width: 992px)";
export const MD_SCREEN = "@media only screen and (min-width: 768px)";
export const SM_SCREEN = "@media only screen and (min-width: 576px)";
export const QUERIES = {
  sm: SM_SCREEN.slice(7), // omit '@media' string neccessary for CSS
  md: MD_SCREEN.slice(7),
  lg: LG_SCREEN.slice(7),
  xl: XL_SCREEN.slice(7),
};

export const TOOLS = {
  SELECT: {
    cssClass: "hand-pointer",
    unicode: "\uf25a",
  },
  RECT: {
    cssClass: "vector-square",
    unicode: "\uf5cb",
  },
  ELLIPSE: {
    cssClass: "circle",
    unicode: "\uf111",
  },
  LABEL: {
    cssClass: "font",
    unicode: "\uf031",
  },
  PATH: {
    cssClass: "bezier-curve",
    unicode: "\uf55b",
  },
};

export const COLOURS = {
  none: "transparent",
  // grey: "#808080",
  blue: "#432C86",
  red: "#E4120D",
  magenta: "#C2368C",
  cyan: "#018ECC",
  orange: "#F08000",
  green: "#79BA4A",
  yellow: "#FFEC01",
  white: '#FFFFFF'
};

export const KEYCODES = {
  SHIFT: 16,
  SPACE: 32
};

export const FORMATS = {
  A4_PORTRAIT: {
    format: 'a4', landscape: false, width: 210, height: 297
  },
  A4_LANDSCAPE: {
    format: 'a4', landscape: true, width: 297, height: 210
  },
  A3_PORTRAIT: {
    format: 'a3', landscape: false, width: 297, height: 420
  },
  A3_LANDSCAPE: {
    format: 'a3', landscape: true, width: 420, height: 297
  }
}

// Mapping to liblouis table names
export const BRAILLE_SYSTEMS = {
  DE: { 
    // BIDI: "de-g0-bidi.utb", 
    BASIS: "de-g0.utb", 
    VOLL: "de-g1.ctb", 
    KURZ: "de-g2.ctb"
  },
};

export const TEXTURES = [
  null,
  "diagonal_lines",
  "diagonal_lines_wide",
  "fill",
  "vertical_lines",
  "horizontal_lines",
  "dashed_lines",
  "grid",
  "stair",
  "dotted_tight",
  "dotted",
];

export const GERMAN_STATES = [
  { value: "BW", label: "Baden-Württemberg" },
  { value: "BY", label: "Bayern" },
  { value: "BE", label: "Berlin" },
  { value: "BB", label: "Brandenburg" },
  { value: "HB", label: "Bremen" },
  { value: "HH", label: "Hamburg" },
  { value: "HE", label: "Hessen" },
  { value: "MV", label: "Mecklenburg-Vorpommern" },
  { value: "NI", label: "Niedersachsen" },
  { value: "NW", label: "Nordrhein-Westfalen" },
  { value: "RP", label: "Rheinland-Pfalz" },
  { value: "SL", label: "Saarland" },
  { value: "SN", label: "Sachsen" },
  { value: "ST", label: "Sachsen-Anhalt" },
  { value: "SH", label: "Schleswig-Holstein" },
  { value: "TH", label: "Thüringen" },
];

export const EWR = [
  { label: "Island", value: "ISL" },
  { label: "Liechtenstein", value: "LIE" },
  { label: "Norwegen", value: "NOR" },
  { label: "Belgien", value: "BEL" },
  { label: "Bulgarien", value: "BGR" },
  { label: "Dänemark", value: "DNK" },
  { label: "Deutschland", value: "DEU" },
  { label: "Estland", value: "EST" },
  { label: "Finnland", value: "FIN" },
  { label: "Frankreich", value: "FRA" },
  { label: "Griechenland", value: "GRC" },
  { label: "Irland", value: "IRL" },
  { label: "Italien", value: "ITA" },
  { label: "Kroatien", value: "HRV" },
  { label: "Lettland", value: "LVA" },
  { label: "Litauen", value: "LTU" },
  { label: "Luxemburg", value: "LUX" },
  { label: "Malta", value: "MLT" },
  { label: "Niederlande", value: "NLD" },
  { label: "Österreich", value: "AUT" },
  { label: "Polen", value: "POL" },
  { label: "Portugal", value: "PRT" },
  { label: "Rumänien", value: "ROU" },
];
