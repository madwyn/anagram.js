import Hash from './Hash.js';

var _      = require("underscore"),
    Chance = require("chance"),
    chance = new Chance();


export default class Dictionary {
    /**
     * Default constructor
     * @param num_total_hash        The total unique hashes
     * @param num_anagram_hash      The total anagram hashes to allocate
     * @param max_anagrams_per_hash The max number of anagrams to generate per hash
     */
    constructor(num_total_hash, num_anagram_hash, max_anagrams_per_hash) {
        this.num_total_hash_        = num_total_hash;
        this.num_anagram_hash_      = num_anagram_hash;
        this.max_anagrams_per_hash_ = max_anagrams_per_hash;

        this.anagram_groups = []; // array of anagrams, grouped by hash
        this.anagrams       = []; // array of anagrams
        this.non_anagrams   = []; // array of non-anagrams
        this.words          = []; // all the words of above two

        this.gen();
    }

    /**
     * Generate anagrams based on the given pattern
     * @param pattern
     * @param num
     * @returns {Array|*}
     */
    static genAnagrams(pattern, num) {
        // shuffle the pattern to generate a new word, generate num times
        return chance.n(chance.shuffle, num, pattern.split('')).map(function(char_arr) {
            return char_arr.join('');
        });
    }

    /**
     * Generate an array of unique strings(words), they all have different hash
     * @param num
     * @returns {Array}
     */
    static genNonAnagrams(num) {
        return chance.unique(chance.string, num, {
            alpha: true,
            comparator: function(arr, val) {
                return arr.reduce(function(acc, word) {
                    return acc || Hash.sort(val) === Hash.sort(word);
                }, false);
            }
        });
    }

    /**
     * Generate the dictionary
     */
    gen() {
        var non_anagrams_pool = Dictionary.genNonAnagrams(this.num_total_hash_);

        // slice the first half as anagram patterns
        var anagram_patterns = non_anagrams_pool.slice(0, this.num_anagram_hash_);

        // slice the second half as non anagrams
        this.non_anagrams = non_anagrams_pool.slice(this.num_anagram_hash_, non_anagrams_pool.length);

        // stores the temporarily generated anagrams, for the sake of readability
        var anagrams_arr;

        // for each pattern, generate its anagrams
        for (var pattern of anagram_patterns) {
            // should generate at least two
            anagrams_arr = Dictionary.genAnagrams(pattern, _.random(2, this.max_anagrams_per_hash_));
            this.anagram_groups.push([anagrams_arr]);
        }

        this.anagrams = this.anagram_groups.join().split(',');

        // randomise the order
        this.words = chance.shuffle(this.non_anagrams.concat(this.anagrams));
    }
}
