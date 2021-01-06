import { FORMATS } from "../config/constants"

export const determineFormat = (width, height) => {
    if (width === 297 && height === 210) return FORMATS.A4_LANDSCAPE;
    if (width === 297 && height === 420) return FORMATS.A3_PORTRAIT;
    if (width === 420 && height === 297) return FORMATS.A3_LANDSCAPE;
    return FORMATS.A4_PORTRAIT; // default
}

export const determineDimensions = (format, landscape) => {
    if (format === 'a4' && !landscape) return FORMATS.A4_PORTRAIT;
    if (format === 'a4' && landscape) return FORMATS.A4_LANDSCAPE;
    if (format === 'a3' && !landscape) return FORMATS.A3_PORTRAIT;
    if (format === 'a3' && landscape) return FORMATS.A3_LANDSCAPE;
}