export default params => {
    return Object.keys(params).map(function(key) {
        return [key, params[key]].map(encodeURIComponent).join("=");
    }).join("&");
}

// https://stackoverflow.com/questions/111529/how-to-create-query-parameters-in-javascript