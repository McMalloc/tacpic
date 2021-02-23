const replaceEntity = string => {
    let finalString = string;
    for (let entity in entities) {
        finalString = finalString.replace(entity, String.fromCharCode(entities[entity] || ""));
    }
    return finalString;
}

const entities = {
    '&#8211;': 0x2013
}

export default replaceEntity;