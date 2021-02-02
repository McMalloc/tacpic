
/* eslint no-undef: off */
importScripts('/scripts/liblouis-3-16-1-no-tables-utf32.js', '/scripts/easy-api.js');

liblouis.enableOnDemandTableLoading("/scripts/tables/");
console.log("Loaded liblouis version " + liblouis.version() + " in web worker.");

onmessage = event => {
    const { text, system } = event.data;
    let result = "";

    // TODO liblouis (js, nicht nativ) schmiert bei einer Zeichenkette wie "w w w" ab

    try {
        result = text
            .trim()
            .split("\n")
            .map(row => liblouis.translateString(system, row))
            .join("\n");
    } catch (error) {
        console.error(error);
        postMessage("");
    }

    postMessage(result);
}