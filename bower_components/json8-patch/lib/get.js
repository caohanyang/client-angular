'use strict'

var JSON8Pointer = require('json8-pointer')
var walk = JSON8Pointer.walk
var parse = JSON8Pointer.parse

/**
 * @typedef OperationResult
 * @type Object
 * @property {Any}   doc       - The patched document
 * @property {Array} previous  - The previous/replaced value if any
 */

/**
 * Get the value at the JSON Pointer location
 *
 * @param  {Object|Array} doc   - JSON document
 * @param  {String|Array} path  - JSON Pointer string or tokens path
 * @return {Any}                - value at the JSON Pointer location
 */
module.exports = function get(doc, path) {
  var tokens = parse(path)

  // returns the document
  if (tokens.length === 0)
    return doc

  var r = walk(doc, tokens)
  var token = r[0]
  var parent = r[1]

  return parent[token]
}
