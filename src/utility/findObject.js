export const findObject = (objects, uuid) => {

    return objects.find(object => {
        return object.uuid === uuid;
    });

};
