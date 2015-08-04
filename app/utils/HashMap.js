export default class HashMap {
    /**
     * Default constructor, wrap around JavaScript object which was implemented as HashMap
     */
    constructor() {
        this.map_ = {};
    }


    /**
     * Removes all of the mappings from this map.
     */
    clear() {
        this.map_ = {};
    }


    /**
     * Returns true if this map contains a mapping for the specified key.
     * @param key
     * @returns {boolean}
     */
    containsKey(key) {
        return key in this.map_;
    }


    /**
     * Associates the specified value with the specified key in this map.
     * @param key
     * @param value
     */
    put(key, value) {
        this.map_[key] = value;
    }


    /**
     * Returns the value to which the specified key is mapped, or 'undefined' if this map contains no mapping for the key.
     * @param key
     * @returns {Object}
     */
    get(key) {
        return this.map_[key];
    }


    /**
     * Removes the mapping for the specified key from this map if present.
     * @param key
     */
    remove(key) {
        delete this.map_[key];
    }


    /**
     * Returns the number of key-value mappings in this map.
     * @returns {number}
     */
    size() {
        return Object.keys(this.map_).length;
    }


    /**
     * Returns true if this map contains no key-value mappings.
     * @returns {boolean}
     */
    isEmpty() {
        return (this.size() == 0);
    }


    /**
     * Returns a Set view of the keys contained in this map.
     * @returns {Array}
     */
    keySet() {
        return Object.keys(this.map_);
    }


    /**
     * Returns a Collection view of the values contained in this map.
     * @returns {Array}
     */
    values() {
        var self = this;

        return this.keySet().map(function(key) {
            return self.get(key);
        });
    }
}
