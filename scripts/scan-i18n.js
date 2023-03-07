var fs = require('fs');
var { Parser } = require('i18next-scanner');

var customHandler = function(key) {
    var defaultValue = key; // optional default value
    parser.set(key, defaultValue);
};

var parser = new Parser();
// Parse HTML Attribute
// <div data-i18n="key"></div>
const html = fs.readFileSync('../src/index.html', 'utf-8');

parser
    .parseAttrFromString(html, customHandler) // pass a custom handler
    .parseAttrFromString(html, { list: ['data-i18n'] }) // override `attr.list`
    .parseAttrFromString(html, { list: ['data-i18n'] }, customHandler)
    .parseAttrFromString(html); // using default options and handler

var translations = parser.get().en.translation;

if (!fs.existsSync('../static/i18n')) fs.mkdirSync('../static/i18n');

fs.writeFileSync('../static/i18n/template.json', JSON.stringify(translations, null, "\t"));