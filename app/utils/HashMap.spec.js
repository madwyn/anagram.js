import HashMap       from './HashMap.js';
import { testTimes } from './TestHelper.js';

var _      = require("underscore"),
    Chance = require("chance"),
    chance = new Chance();

/**
 * Fill a map with random entries
 * @param map
 * @param num Number of entries to fill
 * @returns {Number}
 */
function fillMap(map, num) {
    _(num).times(function() {
        map.put(chance.guid(), chance.guid());
    });

    return num;
}

/**
 * Randomly remove several entries from the map
 * @param map
 * @param num Number of entries to remove
 * @returns {Number}
 */
function reduceMap(map, num) {
    var keys    = map.keySet(),
        key_idx = 0;

    num = (num <= map.size()) ? num : map.size();

    _(num).times(function() {
        // get random key index [0, length - 1]
        key_idx = _.random(0, keys.length - 1);

        // remove the entry from map
        map.remove(keys[key_idx]);

        // remove the key from keys
        keys.splice(key_idx, 1);
    });

    return num;
}

/**
 * Fill a map with random number of random entries
 * @param map
 * @param num Number range from [1, num]
 * @returns {Number}
 */
function fillMapRand(map, num) {
    // prepare the map with different entries
    return fillMap(map, _.random(1, num));
}

describe('utils: HashMap', function() {
    var map        = new HashMap();
    var test_times = 1;

    beforeEach(function() {
        test_times = testTimes();
        fillMapRand(map, test_times);
    });

    afterEach(function() {
        map.clear();
    });

    describe('constructor()', function() {
        it('should create an empty object after constructed', function() {
            map = new HashMap();
            expect(map.size()).toEqual(0);
            expect(map.isEmpty()).toBeTruthy();
        });
    });

    describe('clear()', function() {
        it('should clear all the entries, left the map size zero and empty', function() {
            // should have elements filled
            expect(map.size()).toBeGreaterThan(0);
            map.clear();
            expect(map.size()).toEqual(0);
            expect(map.isEmpty()).toBeTruthy();
        });
    });

    describe('get()', function() {
        it('should not get anything from an empty HashMap', function() {
            map.clear();

            var key = chance.guid(),
                value = map.get(key);

            expect(typeof value).toEqual('undefined');
        });

        it('should get an entry with existing key', function() {
            var key,
                value,
                key_test,
                value_test;

            // prepare the map with different entries
            var num_entires = _.random(1, test_times),
                key_idx     = _.random(0, num_entires - 1),
                i;

            for (i = 0; i < num_entires; ++i) {
                key   = chance.guid();
                value = chance.guid();
                map.put(key, value);

                // keep the random k-v pair
                if (key_idx == i) {
                    key_test   = key;
                    value_test = value;
                }
            }

            var value_get = map.get(key_test);
            expect(value_test).toEqual(value_get);
        });

        it('should not get anything using an non-existing key', function() {
            var key = chance.guid(),
                value = map.get(key);

            expect(typeof value).toEqual('undefined');
        });

    });

    describe('put()', function() {
        it('should put multiple entries and these entries are accessible and correct', function() {
            // prepare the entries
            var keys   = [],
                values = [],
                key,
                value;

            _(_.random(1, test_times)).times(function() {
                key = chance.guid();
                value = chance.guid();
                map.put(key, value);
                keys.push(key);
                values.push(value);
            });

            for (var i = 0; i < keys.length; ++i) {
                // check the value
                expect(map.get(keys[i])).toEqual(values[i]);
            }
        });

        it('should increase the map size after entries been put', function() {
            var size_ori = map.size(),
                num      = fillMapRand(map, test_times);

            expect(map.size()).toEqual(size_ori + num);
        });

        it('should keep one entry for putting one duplicate entry', function() {
            var key   = chance.guid(),
                value = chance.guid();

            map.put(key, value);

            var size_ori = map.size();

            map.put(key, value);

            expect(map.size()).toEqual(size_ori);
        });

        it('should keep one entry for putting multiple duplicate entries', function() {
            var key   = chance.guid(),
                value = chance.guid();

            map.put(key, value);

            var size_ori = map.size();

            var num_entries = _.random(2, test_times);

            _(num_entries).times(function() {
                map.put(key, value);
            });

            expect(map.size()).toEqual(size_ori);
        });

        it('should update the entry if put one duplicate entry with different value', function() {
            var key       = chance.guid(),
                value     = chance.guid(),
                value_new = chance.guid();

            map.put(key, value);

            var size_ori = map.size();

            map.put(key, value_new);
            expect(map.size()).toEqual(size_ori);
            expect(map.get(key)).toEqual(value_new);
        });

        it('should update the entry if put multiple duplicate entries with different values', function() {
            var key       = chance.guid(),
                value     = chance.guid(),
                value_new = chance.guid();

            // put the initial k-v pair
            map.put(key, value);

            var size_ori = map.size();

            var num_entries = _.random(2, test_times);

            _(num_entries).times(function() {
                value_new = chance.guid();
                map.put(key, value_new);
            });

            expect(map.size()).toEqual(size_ori);
            expect(map.get(key)).toEqual(value_new);
        });

    });

    describe('remove()', function() {
        it('should remove existing entries also reduce size accordingly', function() {
            var keys         = map.keySet(),
                keys_removed = [],
                num_remove   = _.random(1, keys.length),
                key_idx      = 0,
                size_ori     = map.size();

            // randomly remove the entries
            for (var i = 0; i < num_remove; i++) {
                // get random key index
                key_idx = _.random(0, keys.length - 1);

                // remove the entry from map
                map.remove(keys[key_idx]);

                // store the removed key
                keys_removed.push(keys[key_idx]);

                // remove the key from keys
                keys.splice(key_idx, 1);
            }

            // verify
            for (var key of keys_removed) {
                expect(map.containsKey(key)).toBeFalsy();
            }

            expect(map.size()).toEqual(size_ori - num_remove);
            expect(map.size()).toBeLessThan(size_ori);
        });

        it('should not remove anything with non-existing key', function() {
            var num_attempts = _.random(1, map.size()),
                size_ori     = map.size();

            // randomly remove the entries
            for (var i = 0; i < num_attempts; i++) {
                // remove the entry from map
                map.remove(chance.guid());
            }

            expect(map.size()).toEqual(size_ori);
        });

        it('should be able to remove all the entries from the map, the map will be empty', function() {
            var keys = map.keySet();

            for (var key of keys) {
                map.remove(key);
            }

            expect(map.size()).toEqual(0);
            expect(map.isEmpty()).toBeTruthy();
        });
    });

    describe('size()', function() {
        describe('empty HashMap', function() {
            beforeEach(function() {
                map.clear();
            });

            it('should tell that empty map has zero size', function() {
                expect(map.size()).toEqual(0);
            });

            it('should increase the size after entries been put', function() {
                var num = fillMapRand(map, test_times);
                expect(map.size()).toEqual(num);
            });
        });

        describe('filled HashMap', function() {
            it('should increase size after entries been put', function() {
                var size_ori = map.size(),
                    num      = fillMapRand(map, test_times);

                expect(map.size()).toEqual(size_ori + num);
                expect(map.size()).toBeGreaterThan(size_ori);
            });

            it('should decrease size after entries been removed ', function() {
                var size_ori = map.size(),
                    num_reduce = _.random(1, size_ori),
                    num = reduceMap(map, num_reduce);

                expect(map.size()).toEqual(size_ori - num);
                expect(map.size()).toBeLessThan(size_ori);
            });
        });
    });

    describe('containsKey()', function() {
        it('should find the existing keys', function() {
            var value = chance.guid(),
                keys  = [];

            // put new entries
            var num_entries = _.random(1, test_times),
                i;

            for (i = 0; i < num_entries; ++i) {
                keys.push(chance.guid());
                map.put(keys[i], value);
            }

            // verify
            for (var key of keys) {
                expect(map.containsKey(key)).toBeTruthy();
            }
        });

        it('should not find non-existing keys', function() {
            var keys  = [];

            // put new entries
            var num_entries = _.random(1, test_times);

            _(num_entries).times(function() {
                keys.push(chance.guid());
            });

            // verify
            for (var key of keys) {
                expect(map.containsKey(key)).toBeFalsy();
            }
        });

        it('should not find deleted keys', function() {
            var key,
                value = chance.guid(),
                keys  = [];

            // put new entries
            var num_entries = _.random(1, test_times),
                i;

            for (i = 0; i < num_entries; ++i) {
                keys.push(chance.guid());
                map.put(keys[i], value);
            }

            // remove entries
            for (key of keys) {
                map.remove(key);
            }

            // verify
            for (key of keys) {
                expect(map.containsKey(key)).toBeFalsy();
            }
        });
    });

    describe('isEmpty()', function() {
        describe('empty HashMap', function() {
            it('should return true for new HashMap', function() {
                map.clear();
                expect(map.isEmpty()).toBeTruthy();
            });
        });

        describe('filled HashMap', function() {
            //it('should return true after clear() the HashMap, TESTED in clear()', function() {});

            it('should return false when the map is not empty', function() {
                expect(map.isEmpty()).toBeFalsy();
            });
        });
    });

    describe('keySet()', function() {
        it('should return empty key set for empty map', function() {
            map.clear();
            expect(map.keySet()).toEqual([]);
        });

        it('should return the exact keys put in the map', function() {
            map.clear();

            var value = chance.guid(),
                keys  = [];

            // put new entries
            var num_entries = _.random(1, test_times),
                i;

            for (i = 0; i < num_entries; ++i) {
                keys.push(chance.guid());
                map.put(keys[i], value);
            }

            var key_list = map.keySet();

            expect(keys.length).toEqual(key_list.length);

            // sort them so comparing may be faster
            keys.sort();
            key_list.sort();

            for (i = 0; i < keys.length; ++i) {
                expect(keys[i]).toEqual(key_list[i]);
            }
        });
    });

    describe('values()', function() {
        it('should return values for empty map', function() {
            var map = new HashMap();
            expect(map.values()).toEqual([]);
        });

        it('should return the exact values put in the map', function() {
            var map = new HashMap();

            var values = [];

            // put new entries
            var num_entries = _.random(1, test_times),
                i;

            for (i = 0; i < num_entries; ++i) {
                values.push(chance.guid());
                map.put(chance.guid(), values[i]);
            }

            var value_list = map.values();

            expect(values.length).toEqual(value_list.length);

            // sort them so comparing may be faster
            values.sort();
            value_list.sort();

            for (i = 0; i < values.length; ++i) {
                expect(values[i]).toEqual(value_list[i]);
            }
        });
    });
});
