"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringToArray = exports.clampString = exports.slice = void 0;

var GraphemeSplitter = require("grapheme-splitter");

var splitter = new GraphemeSplitter();
/**
 * サロゲートペア・合成絵文字を考慮して文字列を切り取る
 * powered by grapheme-splitter
 * @param str 文字列
 * @param length 長さ
 */

function slice(str, length) {
  var array = splitter.splitGraphemes(str);
  var ret = array.slice(0, length);
  return ret.join("");
}

exports.slice = slice;
/**
 * サロゲートペア・合成絵文字を考慮して、指定文字数が超えていたら末尾に指定の文字列を追加して返す
 */

function clampString(str, length, endLetter) {
  if (endLetter === void 0) {
    endLetter = "";
  }

  var array = splitter.splitGraphemes(str);

  if (length < array.length) {
    return slice(str, length) + endLetter;
  }

  return str;
}

exports.clampString = clampString;
/**
 * 文字列をサロゲートペア・合成絵文字を考慮して配列化する
 * powered by grapheme-splitter
 * @param str 文字列
 */

function stringToArray(str) {
  return splitter.splitGraphemes(str);
}

exports.stringToArray = stringToArray;