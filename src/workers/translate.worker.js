
/* eslint no-undef: off */
importScripts('/scripts/liblouis-3-16-1-no-tables-utf32.js', '/scripts/easy-api.js');

liblouis.enableOnDemandTableLoading("/scripts/tables/");
console.log("Loaded liblouis version " + liblouis.version() + " in web worker.");

onmessage = function (event) {
    const { text, system } = event.data;
    postMessage(liblouis.translateString(system, text));
}