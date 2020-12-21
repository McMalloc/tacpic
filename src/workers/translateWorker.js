importScripts('/scripts/liblouis-3-16-1-no-tables-utf32.js', '/scripts/easy-api.js');

liblouis.enableOnDemandTableLoading("/scripts/tables/");
console.log("Loaded liblouis version " + liblouis.version() + " in web worker.");

// console.log(
//     // gibt unicode zeichen aus
//     liblouis.translateString("unicode.dis,de-de-g0.utb", "10 Ziegen")
// )

// console.log(
//     liblouis.translateString("de-de-g0.utb", "10 Ziegen"),
// )

// flow von Worker kontrollieren:
// https://stackoverflow.com/questions/50812026/is-there-some-kind-of-load-event-for-web-workers