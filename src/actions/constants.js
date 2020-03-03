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

export const USER       = constants('USER',     ['LOGIN', 'CREATE', 'SAVE_LAYOUT', 'VALIDATE']);
export const SEARCH     = constants('SEARCH',   ['QUERY']);
export const PRODUCT    = constants('PRODUCT',  ['FETCH', 'GET']);
export const FILE       = constants('FILE',     ['OPEN']);
export const RESSOURCES = constants('RESSOURCES',['GET']);
export const VERSION    = constants('VERSION',   ['GET', 'CREATE']);
export const GRAPHIC    = constants('GRAPHIC',   ['CREATE']);
export const VARIANT    = constants('VARIANT',   ['GET', 'CREATE', 'UPDATE']);
export const CATALOGUE  = constants('CATALOGUE',   ['SEARCH']);
export const TAGS       = constants('TAGS',     ['GET', 'SEARCH', 'CREATE']);
export const BRAILLE    = constants('BRAILLE',   ['TRANSLATE']);

export const CANVAS_OBJECT_ADDED = 'CANVAS_OBJECT_ADDED';
export const CANVAS_OBJECT_REMOVED = 'CANVAS_OBJECT_REMOVED';
export const CANVAS_OBJECT_MODIFIED = 'CANVAS_OBJECT_REMOVED';