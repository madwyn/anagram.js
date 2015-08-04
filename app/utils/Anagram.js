import HashMap from './HashMap.js';
import Hash    from './Hash.js';


export default class Anagram {
    /**
     * The default constructor, takes no parameters
     */
    constructor() {
        this.word_map_    = new HashMap();
        this.word_num_    = 0;
        this.anagram_map_ = new HashMap();
        this.anagram_num_ = 0;

        this.long_key_    = ''; // the anagram contains longest words
        this.most_key_    = ''; // the anagram contains most words
        this.most_num_    = 0;  // the number of words the biggest anagram contains
    }

    /**
     * Clears everything, becomes a virgin
     */
    clear() {
        this.word_map_.clear();
        this.anagram_map_.clear();
        this.word_num_    = 0;
        this.anagram_num_ = 0;
        this.long_key_    = '';
        this.most_key_    = '';
        this.most_num_    = 0;
    }

    /**
     * Feed a word to the anagram processor
     * @param word
     */
    feed(word) {
        // one more word
        this.word_num_++;

        // hash the word, a k-v pair, you need the hash anyway, there is no skip of this
        var key = Hash.sort(word);

        // the temp word list
        var words = [];

        // in the anagrams map
        if (this.anagram_map_.containsKey(key)) {
            words = this.anagram_map_.get(key).concat(word);// assemble the new word list

            this.anagram_map_.put(key, words);              // store the word list
            this.anagram_num_++;                            // one more anagram
            this.challenge_(key, words);                    // update the longest and biggest anagram
        } else {
            // in the word map
            if (this.word_map_.containsKey(key)) {
                words = this.word_map_.get(key).concat(word);   // assemble the new word list

                this.word_map_.remove(key);                     // remove from word map

                this.anagram_map_.put(key, words);              // push them to anagram map
                this.anagram_num_ += words.length;              // more anagrams, specifically two(2 == words.length) by design
                this.challenge_(key, words);                    // update the longest and biggest anagram
            } else {
                this.word_map_.put(key, [word]);                // new word, put it in the word map
            }
        }
    }


    /**
     * Feed an array of words
     * @param words
     */
    feedArray(words) {
        for (var word of words) {
            this.feed(word);
        }
    }

    /**
     * Find the anagrams of a given word, returns an array if there is any, undefined if none
     * @param word
     * @returns {Array|undefined}
     */
    find(word) {
        return this.anagram_map_.get(Hash.sort(word));
    }

    /**
     * Get the anagram contains most words, returns an array if there is any, undefined if none
     * @returns {Array|undefined}
     */
    getBiggestAnagram() {
        return this.find(this.most_key_);
    }

    /**
     * Get the anagram contains longest words, returns an array if there is any, undefined if none
     * @returns {Array|undefined}
     */
    getLongestAnagram() {
        return this.find(this.long_key_);
    }

    /**
     * Challenge the longest and biggest anagram
     * @param key
     * @param words
     * @private
     */
    challenge_(key, words) {
        if (key.length > this.long_key_.length) {
            this.long_key_ = key;
        }

        if (words.length > this.most_num_) {
            this.most_key_ = key;
            this.most_num_ = words.length;
        }
    }

    /**
     * Returns the number of total words processed.
     * @returns {number}
     */
    wordNum() {
        return this.word_num_;
    }

    /**
     * Returns the number of total words which are anagrams
     * @returns {number|Number|*}
     */
    anagramNum() {
        return this.anagram_num_;
    }

    /**
     * Returns the collected anagrams in an array.
     * @returns {Array}
     */
    getAnagrams() {
        return this.anagram_map_.values();
    }

    /**
     * Returns the collected anagrams in an array.
     * @returns {Array}
     */
    getAnagrammaticWords() {
        return this.anagram_map_.values().join().split(',');
    }
}
