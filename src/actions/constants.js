function constants(domain, methods) {
    let obj = {};
    methods.forEach((method) => {
        ['REQUEST', 'SUCCESS', 'FAILURE'].forEach((state) => {
            obj[method] = obj[method] || {};
            obj[method][state] = `${domain}_${method}_${state}`
        });
    });
    return obj;
}

export const USER       = constants('USER',     ['LOGIN', 'CREATE', 'SAVE_LAYOUT']);
export const PRODUCT    = constants('PRODUCT',  ['FETCH', 'GET']);
export const PAGE       = constants('PAGE',     ['GET']);
export const RESSOURCES = constants('RESSOURCES',   ['GET']);

export const CANVAS_OBJECT_ADDED = 'CANVAS_OBJECT_ADDED';
export const CANVAS_OBJECT_REMOVED = 'CANVAS_OBJECT_REMOVED';
export const CANVAS_OBJECT_MODIFIED = 'CANVAS_OBJECT_REMOVED';