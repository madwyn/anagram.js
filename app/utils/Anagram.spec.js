import Anagram    from './Anagram.js';
import Dictionary from './Dictionary.js';
import Hash       from './Hash.js';

var _      = require('underscore'),
    Chance = require("chance"),
    chance = new Chance();


// Test cases for both Anagram and Dictionary, as they test each other
describe('utils: Anagram', function() {

    var test_times           = 500,
        anagram_ratio        = 0.3,
        max_anagram_per_hash = 5,
        anagram = new Anagram(),
        dict    = new Dictionary(test_times, test_times * anagram_ratio, max_anagram_per_hash);

    beforeEach(function() {
        anagram.clear();
    });

    // prepare the test data
    describe('constructor()', function() {
        it('new Anagram should have zero word', function() {
            expect(anagram.anagramNum()).toEqual(0);
        });

        it('new Anagram should have zero anagram', function() {
            expect(anagram.anagramNum()).toEqual(0);
        });
    });

    describe('feed only common words, unique hashes', function() {
        it('the word count should equal to the fed words', function() {
            anagram.feedArray(dict.non_anagrams);
            expect(anagram.getAnagrams().length).toEqual(0);
        });

        it('no anagram should be found', function() {
            anagram.feedArray(dict.non_anagrams);
            expect(anagram.wordNum()).toEqual(dict.non_anagrams.length);
        });
    });

    describe('feed only anagrams', function() {
        it('the anagram hashes should equal to the anagram groups created', function() {
            anagram.feedArray(dict.anagrams);
            expect(anagram.getAnagrams().length).toEqual(dict.anagram_groups.length);
        });

        it('the total anagrams found should match the generated ones', function() {
            anagram.feedArray(dict.anagrams);
            expect(anagram.getAnagrammaticWords().length).toEqual(dict.anagrams.length);
        });

        it('the total input words should equal to the anagram count', function() {
            anagram.feedArray(dict.anagrams);
            // the total input words should equal to the total anagram word number
            expect(anagram.wordNum()).toEqual(anagram.anagramNum());
        });
    });

    describe('feed a mixture of common words and anagrams', function() {
        it('the anagram hashes should equal to the anagram groups created', function() {
            anagram.feedArray(dict.words);
            expect(anagram.getAnagrams().length).toEqual(dict.anagram_groups.length);
        });

        it('the total anagrams found should match the generated ones', function() {
            anagram.feedArray(dict.words);
            expect(anagram.getAnagrammaticWords().length).toEqual(dict.anagrams.length);
        });

        it('the total input words should match the word count', function() {
            anagram.feedArray(dict.words);
            expect(anagram.wordNum()).toEqual(dict.words.length);
        });
    });

    describe('the anagrams are really anagrams', function() {
        it('each word in the same anagram group should have the same hash', function() {
            anagram.feedArray(dict.words);

            var anagram_groups = anagram.getAnagrams(),
                hashes,
                diff;

            // each anagram group should have the same hash
            for (var anagrams of anagram_groups) {
                hashes = anagrams.map(Hash.sort);
                diff   = _.difference([hashes[0]], hashes.slice(1, hashes.size));
                expect(diff.length).toEqual(0);
            }
        });

        it('all the anagram group have unique hash', function() {
            anagram.feedArray(dict.words);

            var anagram_groups = anagram.getAnagrams();

            var hashes = anagram_groups.map(function(anagrams) {
                return Hash.sort(anagrams[0]);
            }).sort();

            var diff = _.difference([hashes[0]], hashes.slice(1, hashes.size));
            expect(diff.length).toEqual(1);
        });
    })
});
