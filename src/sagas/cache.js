import moment from 'moment';
import { CACHE_TIMEOUT } from '../config/constants';

const cache = {};

const setCache = (key, value, timeout = CACHE_TIMEOUT) => {
    cache[key] = {timestamp: moment().add(timeout, 'seconds'), value};
}

const getCache = (key) => {
    if (!cache[key]) return null;
    if (cache[key].timestamp < moment()) return null; // invalidated
    return cache[key].value;
}

export {setCache, getCache};