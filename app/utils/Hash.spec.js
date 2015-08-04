import Hash from './Hash.js';
import { testTimes }     from './TestHelper.js';

const ASCII_a = 'a'.charCodeAt(0);

var _      = require('underscore'),
    Chance = require('chance'),
    chance = new Chance();

describe('utils: Hash', function() {
    var test_times = 1;

    beforeEach(function() {
        test_times = testTimes(); // test random times
    });

    describe('norm_()', function() {

        it('should strip symbols and lower cases', function() {
            var norm;

            _(test_times).times(function() {
                norm = Hash.norm_(chance.string());
                // check the normalised word, should have no characters other than [a, z]
                expect(norm.search(/[^a-z]+/g)).toEqual(-1);
            });
        });

        it('should give an empty string for symbol strings', function() {
            var norm;

            _(test_times).times(function() {
                norm = Hash.norm_(chance.string({symbols: true}));
                expect(norm.length).toEqual(0);
            });
        });
    });

    describe('sort()', function() {
        it('can hash a single character', function() {
            var char = chance.character({alpha: true}),
                hash = Hash.sort(char);

            expect(hash).toEqual(char.toLowerCase());
        });

        it('can hash alphanumeric words and keep the length', function() {
            var word,
                hash;

            _(test_times).times(function() {
                word = chance.string({alpha: true});
                hash = Hash.sort(word);
                expect(hash.length).toEqual(word.length);
            });
        });

        it('the hash should have a correct alphabet order, from a to z', function() {
            var char_pre, // the previous character
                word,
                hash,
                char;

            _(test_times).times(function() {
                char_pre = 'a';
                word     = chance.string();
                hash     = Hash.sort(word);

                // loop the hash
                for (char of hash) {
                    if (char_pre.charCodeAt(0) > char.charCodeAt(0)) {
                        throw new Error('The sorted hash has an incorrect order, word [' + word + '], hash [' + hash + ']' + char + ', ' + char_pre);
                    }

                    expect(char.charCodeAt(0) >= char_pre.charCodeAt(0)).toBeTruthy();
                    char_pre = char;
                }
            });


        });
    });

    describe('count()', function() {
        it('can hash a single character', function() {
            var char = chance.character({alpha: true, casing: 'lower'}),
                hash = Hash.count(char);

            var counts = hash.split(',');
            expect(counts.length).toEqual(26);  // [a, z], so 26
            expect(counts[char.charCodeAt(0) - 'a'.charCodeAt(0)]).toEqual('1');  // the character should be counted
        });

        it('should count the character number correctly', function() {
            var word,
                hash,
                counts,
                total,      // total characters
                word_low;   // lower cased word

            _(test_times).times(function() {
                word     = chance.string({alpha: true, length: 27});
                hash     = Hash.count(word);
                word_low = word.toLowerCase();

                // get the counts
                counts = hash.split(',').map(function(number) {return Number(number);});
                total  = counts.reduce(function(a, b) {
                    return a + b;
                });

                // the total characters should be correct
                expect(total).toEqual(word.length);

                // there should be that many characters in the word
                for (var i = 0; i < counts.length; ++i) {
                    if (counts[i] > 0) {
                        var reg = new RegExp(String.fromCharCode(ASCII_a + i), 'g');    // find the character
                        expect((word_low.match(reg) || []).length).toEqual(counts[i]);  // compare the matching result
                    }
                }
            });
        });
    });

    describe('count() vs sort()', function() {
        it('count() should beat it and be the champion! But it did NOT! Sort wins, native code beat it.', function() {
            test_times = 50000;
            var words  = chance.n(chance.string, test_times, {alpha: true, casing: 'lower'}),
                word   = '';

            var sort_time = process.hrtime();

            // test sort
            for (word of words) {
                Hash.sort_(word);
            }

            sort_time = process.hrtime(sort_time);

            var count_time = process.hrtime();

            // test count
            for (word of words) {
                Hash.count_(word);
            }

            count_time = process.hrtime(count_time);

            console.info("Execution time (sort) : %ds %dms", sort_time[0],  sort_time[1]/1000000);
            console.info("Execution time (count): %ds %dms", count_time[0], count_time[1]/1000000);

            if (sort_time[0] == count_time[0]) {
                expect(sort_time[1]).toBeLessThan(count_time[1]);
            } else {
                expect(sort_time[0]).toBeLessThan(count_time[0]);
            }
        });
    });
});
