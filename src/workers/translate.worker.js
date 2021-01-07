
/* eslint no-undef: off */
importScripts('/scripts/liblouis-3-16-1-no-tables-utf32.js', '/scripts/easy-api.js');

liblouis.enableOnDemandTableLoading("/scripts/tables/");
console.log("Loaded liblouis version " + liblouis.version() + " in web worker.");

onmessage = event => {
    const { text, system } = event.data;

    let result = "";
    
    try {
        result = text
                    .split("\n")
                    .map(row => liblouis.translateString(system, row))
                    .join("\n");
    } catch (error) {
        console.error(error);
        postMessage(null)
    } 

    postMessage(result);
}