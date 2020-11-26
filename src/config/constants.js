export const A4_MAX_ROWS_PER_PAGE = 28;
export const A4_MAX_CHARS_PER_ROW = 35;
export const A4_WIDTH = 210;
export const A4_HEIGHT = 297;
export const PAGE_NUMBER_BOTTOM = 4;
export const MAX_VALUE_FOR_ORDER = 20000;
export const SVG_MIME = "image/svg+xml";
export const SVG_A4_PX_WIDTH = 793.7;
export const TOOL_SENSIBILITY = 15;
export const SAFE_BORDER = 10;
export const BACKUP_INTERVAL = 3000;

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

export const COLOURS = {
  none: "#FFFFFF",
  grey: "#808080",
  blue: "rgb(67,44,134)",
  red: "#E4120D",
  magenta: "#C2368C",
  cyan: "#018ECC",
  orange: "#F08000",
  green: "#79BA4A",
  yellow: "#FFEC01",
  // white: '#FFFFFF'
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
