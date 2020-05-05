/**
 * Modified version of https://github.com/kentcdodds/match-sorter for autocompleting Koine Greek words
 * The key changes are:
 *  - Generation of possible detransliterations of into Greek of the input, then sorting/filtering the
 *    matches from each possible detransliteration
 *  - Criteria are reordered so "starts with" ranks before "equals", there's a new "exact match" criteria on top, etc
 *    (essentially changes to better fit searching for single words)
 *  - Some irrelevant criteria + the functions for them are removed, e.g. looking for camel case items, acronyms, etc,
 *    so I don't waste cycles evaluating those criteria
 *  - I remove diacritics differently so Greek text is supported, plus I also normalize sigmas
 *
 * TODO: Clean up more to remove features I don't use
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 Kent C. Dodds
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @name match-sorter
 * @license MIT license.
 * @copyright (c) 2019 Kent C. Dodds
 * @author Kent C. Dodds <kent@doddsfamily.us>
 */

import {
  twoLetterTransliterationPossibilities,
  oneLetterTransliterationPossibilities,
} from './TransliterationPossibilities';

const rankings = {
  EXACT_MATCH: 3,
  STARTS_WITH: 2,
  CONTAINS: 1,
  NO_MATCH: 0,
};

matchSorter.rankings = rankings;

/**
 * Takes an array of items and a value and returns a new array with the items that match the given value, considering
 * different possible romanizations of Greek
 * @param {Array} items - the items to sort
 * @param {String} value - the value to use for ranking
 * @param {Number} maxMatches - the maximum number of matches you want to get
 * @param {Object} options - Some options to configure the sorter
 * @return {Array} - the new sorted array
 */
function transliteratedMatchSorter(items, value, maxMatches, options = {}) {
  // not performing any search/sort if value(search term) is empty
  if (!value) return items.slice(0, maxMatches);

  // All search is case insensitive
  value = value.toLowerCase();

  // Generate possible Greek values this word could be a transliteration of and get matches for each of them
  const transliterations = getTransliterations(value);
  const possibleGreekValues = [value, ...transliterations];
  const matchesForGreekValues = [];
  for (const possibleValue of possibleGreekValues) {
    matchesForGreekValues.push(matchSorter(items, possibleValue, options));
  }

  // Find the top matches among the various matches for different Greek values
  const topMatches = [];
  while (topMatches.length < maxMatches) {
    // Get the top match for each possible Greek value, ignoring Greek values that don't have any matches left
    const topMatchForEachGreekValue = matchesForGreekValues
      .map((matchesForGreekValue, greekValueIndex) => {
        return {
          match: matchesForGreekValue[0],
          valueIndex: greekValueIndex,
        };
      })
      .filter(match => !!match.match);

    // Find the overall top among the top matches for each potential value
    const overallTopMatch = topMatchForEachGreekValue.sort((a, b) =>
      sortRankedItems(a.match, b.match)
    )[0];

    if (overallTopMatch) {
      const matchText = overallTopMatch.match.item;
      // Only add this as a new top match if it hasn't already been added (in case multiple potential Greek values
      // matched the same word)
      if (topMatches.indexOf(matchText) === -1) {
        topMatches.push(matchText);
      }
      // Remove this top match from the results so we can move on to the next ones
      matchesForGreekValues[overallTopMatch.valueIndex].shift();
    } else {
      // If no top match was found, there are no matches left for any Greek values
      break;
    }
  }

  return topMatches;
}

/**
 * Returns all possible transliterations for romanized Greek text
 * @param {String} textToTransliterate - the romanized text to transliterate
 * @param {String} transliterationSoFar - the transliteration so far. Used for recursion
 * @return {Array<string>} - an array of potential transliterations
 */
function getTransliterations(textToTransliterate, transliterationSoFar = '') {
  const textLeft = textToTransliterate.length;
  if (textLeft === 0) {
    if (transliterationSoFar === '') {
      return [];
    }
    return [transliterationSoFar];
  }

  const transliterations = [];
  let foundPossibilityForLetter = false;

  if (textLeft >= 2) {
    const nextTwoLetters = textToTransliterate.slice(0, 2);
    for (const possibility of twoLetterTransliterationPossibilities[
      nextTwoLetters
    ] || []) {
      foundPossibilityForLetter = true;
      transliterations.push(
        ...getTransliterations(
          textToTransliterate.slice(2),
          transliterationSoFar + possibility
        )
      );
    }
  }

  const nextLetter = textToTransliterate.slice(0, 1);
  for (const possibility of oneLetterTransliterationPossibilities[nextLetter] ||
    []) {
    foundPossibilityForLetter = true;
    transliterations.push(
      ...getTransliterations(
        textToTransliterate.slice(1),
        transliterationSoFar + possibility
      )
    );
  }

  if (!foundPossibilityForLetter) {
    transliterations.push(
      ...getTransliterations(textToTransliterate.slice(1), transliterationSoFar)
    );
  }

  return transliterations;
}

/**
 * Takes an array of items and a value and returns a new array with the items that match the given value + ranking info
 * @param {Array} items - the items to sort
 * @param {String} value - the value to use for ranking
 * @param {Object} options - Some options to configure the sorter
 * @return {Array} - the sorted array of matches, with ranking information
 */
function matchSorter(items, value, options = {}) {
  const { keys, threshold = rankings.CONTAINS } = options;
  const matchedItems = items.reduce(reduceItemsToRanked, []);
  return matchedItems.sort(sortRankedItems);

  function reduceItemsToRanked(matches, item, index) {
    const {
      rankedItem,
      rank,
      keyIndex,
      keyThreshold = threshold,
    } = getHighestRanking(item, keys, value, options);
    if (rank >= keyThreshold) {
      matches.push({ rankedItem, item, rank, index, keyIndex });
    }
    return matches;
  }
}

/**
 * Gets the highest ranking for value for the given item based on its values for the given keys
 * @param {*} item - the item to rank
 * @param {Array} keys - the keys to get values from the item for the ranking
 * @param {String} value - the value to rank against
 * @param {Object} options - options to control the ranking
 * @return {{rank: Number, keyIndex: Number, keyThreshold: Number}} - the highest ranking
 */
function getHighestRanking(item, keys, value, options) {
  if (!keys) {
    return {
      // ends up being duplicate of 'item' in matches but consistent
      rankedItem: item,
      rank: getMatchRanking(item, value),
      keyIndex: -1,
      keyThreshold: options.threshold,
    };
  }
  const valuesToRank = getAllValuesToRank(item, keys);
  return valuesToRank.reduce(
    (
      { rank, rankedItem, keyIndex, keyThreshold },
      { itemValue, attributes },
      i
    ) => {
      let newRank = getMatchRanking(itemValue, value);
      let newRankedItem = rankedItem;
      const { minRanking, maxRanking, threshold } = attributes;
      if (newRank < minRanking && newRank >= rankings.CONTAINS) {
        newRank = minRanking;
      } else if (newRank > maxRanking) {
        newRank = maxRanking;
      }
      if (newRank > rank) {
        rank = newRank;
        keyIndex = i;
        keyThreshold = threshold;
        newRankedItem = itemValue;
      }
      return { rankedItem: newRankedItem, rank, keyIndex, keyThreshold };
    },
    { rank: rankings.NO_MATCH, keyIndex: -1, keyThreshold: options.threshold }
  );
}

/**
 * Gives a rankings score based on how well the two strings match.
 * @param {String} testString - the string to test against
 * @param {String} stringToRank - the string to rank
 * @returns {Number} the ranking for how well stringToRank matches testString
 */
function getMatchRanking(testString, stringToRank) {
  // stringToRank has already been lowercased
  testString = testString.toLowerCase();
  /* eslint complexity:[2, 12] */
  testString = prepareValueForComparison(testString);
  stringToRank = prepareValueForComparison(stringToRank);

  // too long
  if (stringToRank.length > testString.length) {
    return rankings.NO_MATCH;
  }

  // exact match
  if (testString === stringToRank) {
    return rankings.EXACT_MATCH;
  }

  // starts with
  if (testString.indexOf(stringToRank) === 0) {
    return rankings.STARTS_WITH;
  }

  // contains
  if (testString.indexOf(stringToRank) !== -1) {
    return rankings.CONTAINS;
  } else if (stringToRank.length === 1) {
    // If the only character in the given stringToRank
    //   isn't even contained in the testString, then
    //   it's definitely not a match.
    return rankings.NO_MATCH;
  }

  return rankings.NO_MATCH;
}

/**
 * Sorts items that have a rank, index, and keyIndex
 * @param {Object} a - the first item to sort
 * @param {Object} b - the second item to sort
 * @return {Number} -1 if a should come first, 1 if b should come first, 0 if equal
 */
function sortRankedItems(a, b) {
  const aFirst = -1;
  const bFirst = 1;
  const { rankedItem: aRankedItem, rank: aRank, keyIndex: aKeyIndex } = a;
  const { rankedItem: bRankedItem, rank: bRank, keyIndex: bKeyIndex } = b;
  const same = aRank === bRank;
  if (same) {
    if (aKeyIndex === bKeyIndex) {
      // localeCompare returns 0 if both values are equal,
      // so we rely on JS engines stably sorting the results
      // (de facto, all modern engine do this).
      return String(aRankedItem).localeCompare(bRankedItem);
    } else {
      return aKeyIndex < bKeyIndex ? aFirst : bFirst;
    }
  } else {
    return aRank > bRank ? aFirst : bFirst;
  }
}

/**
 * Prepares value for comparison by stringifying it, removing diacritics, and normalizing sigmas
 * @param {String} value - the value to clean
 * @return {String} the prepared value
 */
function prepareValueForComparison(value) {
  value = `${value}`; // toString

  // Removes diacritics by decomposing accented characters and then removing combining diacritical marks
  // from https://stackoverflow.com/a/45797754/4954731
  value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // normalize sigmas
  value = value.replace(/ς/g, 'σ');

  return value;
}

/**
 * Gets value for key in item at arbitrarily nested keypath
 * @param {Object} item - the item
 * @param {Object|Function} key - the potentially nested keypath or property callback
 * @return {Array} - an array containing the value(s) at the nested keypath
 */
function getItemValues(item, key) {
  if (typeof key === 'object') {
    key = key.key;
  }
  let value;
  if (typeof key === 'function') {
    value = key(item);
    // eslint-disable-next-line no-negated-condition
  } else if (key.indexOf('.') !== -1) {
    // handle nested keys
    value = key
      .split('.')
      .reduce(
        (itemObj, nestedKey) => (itemObj ? itemObj[nestedKey] : null),
        item
      );
  } else {
    value = item[key];
  }
  // concat because `value` can be a string or an array
  // eslint-disable-next-line
  return value != null ? [].concat(value) : null;
}

/**
 * Gets all the values for the given keys in the given item and returns an array of those values
 * @param {Object} item - the item from which the values will be retrieved
 * @param {Array} keys - the keys to use to retrieve the values
 * @return {Array} objects with {itemValue, attributes}
 */
function getAllValuesToRank(item, keys) {
  return keys.reduce((allVals, key) => {
    const values = getItemValues(item, key);
    if (values) {
      values.forEach(itemValue => {
        allVals.push({
          itemValue,
          attributes: getKeyAttributes(key),
        });
      });
    }
    return allVals;
  }, []);
}

/**
 * Gets all the attributes for the given key
 * @param {Object|String} key - the key from which the attributes will be retrieved
 * @return {Object} object containing the key's attributes
 */
function getKeyAttributes(key) {
  if (typeof key === 'string') {
    key = { key };
  }
  return {
    maxRanking: Infinity,
    minRanking: -Infinity,
    ...key,
  };
}

export default transliteratedMatchSorter;
export { rankings };
