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

export const wrapLines = (s, n, useSpaces, a) => {
    a = a || [];
    if (s.length <= n) {
        a.push(s);
        return a;
    }
    let line = s.substring(0, n);
    if (! useSpaces) { // insert newlines anywhere
        a.push(line);
        return wrapLines(s.substring(n), n, useSpaces, a);
    }
    else { // attempt to insert newlines after whitespace
        let lastSpaceRgx = /\s(?!.*\s)/;
        let idx = line.search(lastSpaceRgx);
        let nextIdx = n;
        if (idx > 0) {
            line = line.substring(0, idx);
            nextIdx = idx;
        }
        a.push(line);
        return wrapLines(s.substring(nextIdx), n, useSpaces, a);
    }
};