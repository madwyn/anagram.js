# anagram.js

A NW.js app for resolving [anagrams](https://en.wikipedia.org/wiki/Anagram).

# What is an anagram? Mary and Army.

A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.
-Oxford Dictionary

# Quick start

Install [Node.js](https://nodejs.org) or [io.js](https://iojs.org).

```shell
git clone https://github.com/madwyn/anagram.js.git anagrams
cd anagrams
npm install
npm start
```

It will start an application window, like a simplified Chrome browser.

The demo provides three functions:

1. Load a dictionary. You can also add filters. The dictionary should be a text file, words are divided by newlines. You can use [this test dictionary](http://codekata.com/data/wordlist.txt).

2. Process the dictionary. Find out all the anagrams in the dictionary. A summary will be shown after processing.

3. Search anagrams. Type in any word or pattern to find the corresponding anagrams in the dictionary.

# How does it work?

Given a dictionary (word list), find out all the anagrams within.

## `Hash.js`, a hash function

Given a word, randomise the order of the letters, we get a new word. These two words become a set of anagrams.

The hash function is to differ anagrams. It generates "labels" for each word, so that all words in a set of anagrams have the same label, but any two words from different anagram sets should have different lables.

There are several ways to do this. In this implementation, there are two:

1. `Hash.sort()`, sort the letters.
2. `Hash.count()`, count the letters.

`sort` will label 'time' as 'eimt'. `count` will create an integer array for 26 letters, position [0, 25] for [a, z]. Count the letters in the word. For example: 'ace' will generate [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].

In theory, `count` has an average complexity of O(n) while `sort` has [O(nlog(n))](https://en.wikipedia.org/wiki/Sorting_algorithm). In reality, `sort` is natively implemented in browser and runs much faster than `count`, there is also a dedicated test case for this. 

## `HashMap.js`, a hash map

It's a thin wrap around JavaScript object which is already a HashMap.

HashMap has an average O(1) for inserts and lookups, ideal for anagram processing.

## `Anagram.js`, a simple routine to feed the words 

It has two hash maps, one for the non-anagrammatic words, the other is for the anagrams. The class provides a `feed()` function to consume words.

It also gathers information about the biggest anagram set and the loggest anagrams during feeding.

# Testing

```
npm test
```

# Dependencies

## Working core
There is no dependency for the core modules: `Hash.js`, `HashMap.js` and `Anagram.js`.

## Demo and test
- [NW.js](http://nwjs.io/)
- [byline](https://github.com/jahewson/node-byline)
- [jQuery](https://github.com/jquery/jquery)
- [UIkit](https://github.com/uikit/uikit)
- [RequireJS](https://github.com/jrburke/requirejs)
- [Jasmine](https://github.com/jasmine/jasmine)
- [Underscore.js](https://github.com/jashkenas/underscore)
- [Chance.js](https://github.com/victorquinn/chancejs)
