import {chunk} from "lodash";

export const wrapLines = (text, maxChars, result) => {


    const wrapRegexString = "(\\S(.{0,"+ (maxChars - 2) +"}\\S)?)\\s+";
    // -2 weil vor und nach der gruppe auch noch ein non-whitespace zeichen gematcht wird

    const wrapRegex = new RegExp(wrapRegexString, "g");
    const wordwrapped = (text + ' ').replace(wrapRegex, '$1\n').trim();
    return wordwrapped.split(/\n/);
};

export const wrapAndChunk = (text, maxChars, maxRows) => {
    const wrapped = wrapLines(text, maxChars);
    return chunk(wrapped, maxRows);
}