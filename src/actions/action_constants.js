const action_constants = (domain, methods) => {
    let obj = {};
    methods.forEach((method) => {
        ['REQUEST', 'SUCCESS', 'FAILURE'].forEach((state) => {
            obj[method] = obj[method] || {};
            obj[method][state] = `${domain}_${method}_${state}`;
        });
    });
    return obj;
}


export const APP        = action_constants('APP',     ['FRONTEND', 'BACKEND', 'VERSION', 'LEGAL']);
export const USER       = action_constants('USER',     ['LOGIN', 'LOGOUT', 'CREATE', 'SAVE_LAYOUT', 'VALIDATE', 'VERIFY', 'RESET_REQUEST','RESET','UPDATE']);
export const SEARCH     = action_constants('SEARCH',   ['QUERY']);
export const PRODUCT    = action_constants('PRODUCT',  ['FETCH', 'GET']);
export const FILE       = action_constants('FILE',     ['OPEN']);
export const RESSOURCES = action_constants('RESSOURCES',['GET']);
export const VERSION    = action_constants('VERSION',   ['GET', 'CREATE']);
export const GRAPHIC    = action_constants('GRAPHIC',   ['GET', 'CREATE']);
export const VARIANT    = action_constants('VARIANT',   ['GET', 'CREATE', 'UPDATE', 'HISTORY']);
export const VARIANTS   = action_constants('VARIANTS',   ['GET']); // get multiple variants and info about their parent graphics without versions
export const CATALOGUE  = action_constants('CATALOGUE',   ['SEARCH', 'MORE']);
export const TAGS       = action_constants('TAGS',     ['GET', 'SEARCH', 'CREATE']);
export const BRAILLE    = action_constants('BRAILLE',   ['TRANSLATE']);
export const ORDER      = action_constants('ORDER',   ['CREATE', 'GET', 'INDEX']);
export const QUOTE      = action_constants('QUOTE',   ['REQUEST', 'GET']);
export const ADDRESS    = action_constants('ADDRESS',   ['GET', 'CREATE', 'UPDATE', 'REMOVE']); // TODO rename GET to ADDRESS.INDEX
export const IMPORT    = action_constants('IMPORT',   ['TRACE', 'OCR']);

export const CMS_PAGE    = action_constants('CMS_PAGE',   ['INDEX', 'GET']);
export const CMS_CATEGORY    = action_constants('CMS_CATEGORY',   ['INDEX', 'GET']);

export const CANVAS_OBJECT_ADDED = 'CANVAS_OBJECT_ADDED';
export const CANVAS_OBJECT_REMOVED = 'CANVAS_OBJECT_REMOVED';
export const CANVAS_OBJECT_MODIFIED = 'CANVAS_OBJECT_REMOVED';
export const CHANGE_PAGE_CONTENT = 'CHANGE_PAGE_CONTENT';
export const CHANGE_IMAGE_DESCRIPTION = 'CHANGE_IMAGE_DESCRIPTION';
export const ITEM_ADDED_TO_BASKET = 'ITEM_ADDED_TO_BASKET';
export const ITEM_REMOVED_FROM_BASKET = 'ITEM_REMOVED_FROM_BASKET';
export const ITEM_UPDATED_IN_BASKET = 'ITEM_UPDATED_IN_BASKET';
export const CLEAR_BASKET = 'CLEAR_BASKET';
export const ORDER_RESET = 'ORDER_RESET';
export const RESET_USER_ERRORS = 'RESET_USER_ERRORS';
export const LOAD_MORE = 'LOAD_MORE';
export const SWITCH_CURSOR_MODE = 'SWITCH_CURSOR_MODE';
export const OBJECTS_SWAPPED = 'OBJECTS_SWAPPED';
export const OBJECT_ENTRY = 'OBJECT_ENTRY';
export const SET_PAGE_RENDERINGS = 'SET_PAGE_RENDERINGS';
export const NEW_GRAPHIC_STARTED = 'NEW_GRAPHIC_STARTED';
export const BRAILLE_BULK_TRANSLATED = 'BRAILLE_BULK_TRANSLATED';
export const UPDATE_BRAILLE_CONTENT = 'UPDATE_BRAILLE_CONTENT';
export const CHANGE_FILE_PROPERTY = 'CHANGE_FILE_PROPERTY';
export const CHANGE_FILE_FORMAT = 'CHANGE_FILE_FORMAT';
export const OBJECT_UPDATED = 'OBJECT_UPDATED';
export const OBJECT_BULK_ADD = 'OBJECT_BULK_ADD';
export const ERROR_THROWN = 'ERROR_THROWN';
export const SUPPRESS_BACKUP = 'SUPPRESS_BACKUP';
export const COPY = 'COPY';
export const PASTE = 'PASTE';
export const OBJECT_PROP_CHANGED = 'OBJECT_PROP_CHANGED';