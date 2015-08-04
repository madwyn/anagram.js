const ASCII_a = 'a'.charCodeAt(0);

export default class Hash {
    /**
     * Hashes the word to a comparable value, gives identical values for those share same letter combination regardless their alphabet order and capitalisation.
     * @param word
     * @returns {string}
     */
    static sort(word) {
        return Hash.sort_(Hash.norm_(word));
    }


    /**
     * Hashes the word, count all the presented characters, generates a fixed length sequence
     * @param word
     * @returns {string}
     */
    static count(word) {
        return Hash.count_(Hash.norm_(word));
    }


    /**
     * @private
     * Hashes the word to a comparable value using sort.
     * Complexity is O(n * n) if using selection sort, which Chrome uses.
     * @param word A normalised word
     * @returns {string}
     */
    static sort_(word) {
        return word.split('').sort().join('');
    }


    /**
     * @private
     * Hashes the word, count all the presented characters, generates a fixed length sequence
     * Complexity is O(n)
     * @param word A normalised word
     * @returns {string}
     */
    static count_(word) {
        var hash = Hash.genCountBase_();

        for (var char of word) {
            hash[char.charCodeAt(0) - ASCII_a]++;
        }

        // use join will significantly increase the execution time
        return hash.join();
        //return hash;
    }


    /**
     * @private
     * Returns a preallocated integer array[26]. Why not do following?
     *
     * var hash = new Array(26);  // the elements are all NaN
     * for (var i = 0; i < 26; ++i) {
     *     hash[i] = 0;
     * }
     *
     * You see the hassle, the loop. Here we simply don't need it.
     *
     * @returns {number[]}
     */
    static genCountBase_() {
        return [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0
        ];
    }


    /**
     * @private
     * Normalise a word, strip symbols, digits, keep only [a, z], lower capitalisation
     * @param word
     * @returns {string}
     */
    static norm_(word) {
        return word.toLowerCase().replace(/[^a-z]+/g, '');
    }
}
