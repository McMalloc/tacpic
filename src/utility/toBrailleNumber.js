const chars = "abcdefghij";
export const toBrailleNumbers = number => {
    return "#" + ((number + "").split("").map(n=>chars[parseInt(n)])).join("");
};

export const wrapAndChunk = (text, maxChars, maxRows) => {

}