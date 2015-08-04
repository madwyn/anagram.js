import Anagram from './utils/Anagram.js';
import Hash    from './utils/Hash.js';

var fs     = require('fs'),
    byline = require('byline');


export default class AnagramApp {
    constructor() {
        this.anagram    = new Anagram();
        this.dict       = [];
        this.dict_lines = 0;

        this.filter_symbol = true;
        this.filter_case   = true;
        this.percent       = 0;
        this.time          = 0;

        this.bindComponents();
    }

    /**
     * Reset processing variables
     */
    reset() {
        this.resetDict();
        this.resetAnagram();
    }

    resetDict() {
        this.dict.length = 0;
        this.dict_lines  = 0;
        $('#td_dict_lines').text('');
        $('#td_total_words').text('');
    }

    resetAnagram() {
        this.time    = 0;
        this.percent = -1;
        this.progress(0, 1);
        this.anagram.clear();
        $('#td_anagrammatic_words').text('');
        $('#td_anagram_ratio').text('');
        $('#td_anagrams').text('');
        $('#td_processing_time').text('');
        $('#chk_case').text('');
        $('#chk_symbol').text('');
    }

    /**
     * Bind UI components with event handlers
     */
    bindComponents() {
        var self            = this,
            sel_dict_file   = $('#sel_dict_file'),
            input_dict_file = $('#input_dict_file'),
            btn_process     = $('#btn_process'),
            chk_case        = $('#chk_case'),
            chk_symbol      = $('#chk_symbol');

        // the file selection button
        sel_dict_file.change(function() {
            input_dict_file.val(sel_dict_file.val()).change();
        });

        // the text input
        input_dict_file.change(function() {
            self.dict_file = null;                  // clear file path
            btn_process.prop('disabled', true);     // disable process button
            self.reset();                           // clear everything

            fs.stat(input_dict_file.val(), function(err, stats) {
                if (!err) {
                    if (stats.isFile()) {
                        self.dict_file = input_dict_file.val();

                        self.reset();

                        // generate dictionary
                        self.genDict(input_dict_file.val(), function() {
                            // after count finished, enable the process button
                            btn_process.prop('disabled', false);
                        });
                    } else {
                        self.notify("The input path is not a file.");
                        input_dict_file.select();
                    }
                } else {
                    self.notify("The input file is invalid: " + err);
                    input_dict_file.select();
                }
            });
        });

        // the process button
        btn_process.click(function() {
            self.resetAnagram();
            self.process();
        });

        // use filter checkbox
        chk_case.change(function() {
            self.filter_case = this.checked;
        });


        // use filter checkbox
        chk_symbol.change(function() {
            self.filter_symbol = this.checked;
        });
    }

    /**
     * Set current progress. This progress bar probably won't update smoothly because too much happened so fast.
     * @param cur   Current number
     * @param base  Base number
     */
    progress(cur, base) {
        var percent_new = Math.round((cur / base) * 100);

        if (percent_new > this.percent) {
            this.percent = percent_new;
            $('#progress_bar').width(this.percent.toString() + '%');
        }
    }

    /**
     * Show the results on the UI
     */
    setResults() {
        $('#td_anagrammatic_words').text(this.anagram.anagramNum());
        $('#td_anagram_ratio').text(Math.round((this.anagram.anagramNum() / this.anagram.wordNum()) * 100));
        $('#td_anagrams').text(this.anagram.getAnagrams().length);
        $('#td_processing_time').text(this.time[0] + 's ' + (this.time[1]/1000000) + 'ms');
        $('#txt_long_anagram').text(this.anagram.getLongestAnagram());
        $('#txt_big_anagram').text(this.anagram.getBiggestAnagram());

        // set up auto complete

        var self = this;

        // prepare source
        var data_src = function(release) {
            var data = [{value: 1, items: 'aaa'}];

            release(data);
        };

        var autocomplete = UIkit.autocomplete($('#auto_anagram_search'), {
            'source': function(release) {
                var data = [];

                var anagram = self.anagram.find(this.input.val());
                if (typeof anagram != 'undefined') {
                    data = [{
                        value  : this.input.val(),
                        anagram: anagram
                    }];
                }

                release(data);
            }
        });
    }

    /**
     * Start processing
     */
    process() {
        // check file exist
        if (this.dict.length < 1) {
            return;
        }

        this.time = process.hrtime();

        for (var word of this.dict) {
            this.anagram.feed(word);
            this.progress(this.anagram.wordNum(), this.dict.length);
        }

        this.time = process.hrtime(this.time);

        this.setResults();
    }

    /**
     * Notify on the UI
     * @param message
     */
    notify(message) {
        UIkit.notify(message);
    }

    /**
     * Filter out the unique elements
     * @param a
     * @returns {Array.<T>}
     */
    uniq(a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        })
    }

    /**
     * Count the words of dictionary
     */
    genDict(dict_file, callback) {
        var self   = this,
            file_stream = fs.createReadStream(dict_file, {encoding: 'utf8'}),
            line_stream = byline.createStream(file_stream);

        this.reset();

        line_stream.on('data', function(line) {
            self.dict_lines++;

            if (self.filter_case) {
                line = line.toLowerCase();
            }

            if (self.filter_symbol && (line.toLowerCase().search(/[^a-z]+/g) != -1)) {
                return;
            }

            self.dict.push(line);
        });

        line_stream.on('end', function() {
            self.dict = self.uniq(self.dict);

            $('#td_dict_lines').text(self.dict_lines);
            $('#td_total_words').text(self.dict.length);
            callback();
        });
    }
}
