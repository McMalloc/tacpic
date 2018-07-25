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

export const USER       = constants('USER',     ['LOGIN', 'CREATE']);
export const PRODUCT    = constants('PRODUCT',  ['FETCH', 'GET']);
export const PAGE       = constants('PAGE',     ['GET']);
