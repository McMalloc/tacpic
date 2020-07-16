//
// Folds a string at a specified length, optionally attempting
// to insert newlines after whitespace characters.
//
// s          -  input string
// n          -  number of chars at which to separate lines
// useSpaces  -  if true, attempt to insert newlines at whitespace
// a          -  array used to build result
//
// Returns an array of strings that are no longer than n
// characters long.  If a is specified as an array, the lines
// found in s will be pushed onto the end of a.
//
// If s is huge and n is very small, this metho will have
// problems... StackOverflow.

// Source: http://jsfiddle.net/jahroy/Rwr7q/18/
// TODO: reimplementieren
//

import {chunk} from "lodash";

const lastSpaceRgx = /\s(?!.*\s)/;
// const lastSpaceRgx = /[\s|\n](?!.*[\s|\n])/;
const lastNewlineRgx = /\s(?!.*\s)/;
export const wrapLines = (text, maxChars, result) => {
    result = result || [];
    if (text.length <= maxChars) {
        result.push(text.trim());
        return result;
    }
    let line = text.substring(0, maxChars).trim();

    const idx = line.search(lastSpaceRgx);
    const manualBreakIdx = line.search(/\n/);
    const manualParagraphs = (line.match(/\n/g) || []).length - 1;

    let nextIdx = maxChars;
    if (idx > 0 || manualBreakIdx > 0) {
        nextIdx = idx > 0 && manualBreakIdx > 0 ? Math.min(idx, manualBreakIdx) : idx;
        line = line.substring(0, nextIdx);
    }
    result.push(line.trim());
    for (let i = 0; i < manualParagraphs; i++) result.push("");
    return wrapLines(text.substring(nextIdx), maxChars, result);

};

export const wrapAndChunk = (text, maxChars, maxRows) => {
    let wrapped = [];
    wrapLines(text, maxChars, wrapped);
    return chunk(wrapped, maxRows);
}