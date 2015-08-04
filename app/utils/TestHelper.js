import { max_text_times } from './TestConfig.js';

var _ = require('underscore');

/**
 * Get the test times for this round
 * @returns {Number}
 */
export function testTimes() {
    return _.random(1, max_text_times);
}
