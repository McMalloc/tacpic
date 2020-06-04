function action_constants(domain, methods) {
    let obj = {};
    methods.forEach((method) => {
        ['REQUEST', 'SUCCESS', 'FAILURE'].forEach((state) => {
            obj[method] = obj[method] || {};
            obj[method][state] = `${domain}_${method}_${state}`
        });
    });
    return obj;
}

export const USER       = action_constants('USER',     ['LOGIN', 'LOGOUT', 'CREATE', 'SAVE_LAYOUT', 'VALIDATE']);
export const SEARCH     = action_constants('SEARCH',   ['QUERY']);
export const PRODUCT    = action_constants('PRODUCT',  ['FETCH', 'GET']);
export const FILE       = action_constants('FILE',     ['OPEN']);
export const RESSOURCES = action_constants('RESSOURCES',['GET']);
export const VERSION    = action_constants('VERSION',   ['GET', 'CREATE']);
export const GRAPHIC    = action_constants('GRAPHIC',   ['GET', 'CREATE']);
export const VARIANT    = action_constants('VARIANT',   ['GET', 'CREATE', 'UPDATE']);
export const CATALOGUE  = action_constants('CATALOGUE',   ['SEARCH']);
export const TAGS       = action_constants('TAGS',     ['GET', 'SEARCH', 'CREATE']);
export const BRAILLE    = action_constants('BRAILLE',   ['TRANSLATE']);

export const CANVAS_OBJECT_ADDED = 'CANVAS_OBJECT_ADDED';
export const CANVAS_OBJECT_REMOVED = 'CANVAS_OBJECT_REMOVED';
export const CANVAS_OBJECT_MODIFIED = 'CANVAS_OBJECT_REMOVED';