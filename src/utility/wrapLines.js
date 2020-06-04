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

const lastSpaceRgx = /[\s|\n](?!.*[\s|\n])/;
const lastNewlineRgx = /\n(?!.*\n)/;
export const wrapLines = (text, maxRows, useSpaces, result) => {
    result = result || [];
    if (text.length <= maxRows) {
        result.push(text.trim());
        return result;
    }
    let line = text.substring(0, maxRows);
    if (!useSpaces) { // insert newlines anywhere
        result.push(line.trim());
        return wrapLines(text.substring(maxRows), maxRows, useSpaces, result);
    }
    else { // attempt to insert newlines after whitespace or manually inserted newlines
        let idx = line.search(lastSpaceRgx);
        let possibleManualNewline = line.search(lastNewlineRgx);
        let nextIdx = maxRows;
        if (idx > 0) {
            line = line.substring(0, possibleManualNewline > 0 ? possibleManualNewline : idx);
            nextIdx = idx;
        }
        result.push(line.trim());
        return wrapLines(text.substring(nextIdx), maxRows, useSpaces, result);
    }
};

export const wrapAndChunk = (text, maxChars, maxRows) => {
    let wrapped = [];
    wrapLines(text, maxRows, true, wrapped);
    return chunk(wrapped, maxRows);
}