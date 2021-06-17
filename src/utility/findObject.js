
// TODO kombiniere mit funktionen aus editor_file.js
export const findObject = (objects, uuid) => {
    return objects.find(object => {
        return object.uuid === uuid;
    });

};
