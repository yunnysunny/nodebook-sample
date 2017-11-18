const db = require('./db');
const cacheResult = new Map();
const DEFAULT_CACHE_AGE = 1000;

class CacheItem {
    constructor(data,expire) {
        this.expire = expire || (new Date().getTime() + DEFAULT_CACHE_AGE);
        this.data = data;
    }
}

/*const queryWithCache = */exports.queryWithCache = function(itemName) {
    const item = cacheResult.get(itemName);//console.log(cacheResult.size);

    if (item) {
        if (item.expire > new Date().getTime()) {
            return (item.data);
        }
        cacheResult.delete(item);//console.log('expired cache..........................');
    }

    const value = db[itemName];
    cacheResult.set(itemName,new CacheItem(itemName,value));    
    return (value);
};
