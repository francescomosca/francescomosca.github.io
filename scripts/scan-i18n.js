var fs = require('fs');
var { Parser } = require('i18next-scanner');

var customHandler = function(key) {
    var defaultValue = `__${key}__`; // optional default value
    parser.set(key, defaultValue);
};

var parser = new Parser();
var content = '';

// Parse HTML Attribute
// <div data-i18n="key"></div>
content = fs.readFileSync('../src/index.html', 'utf-8');

parser
    .parseAttrFromString(content, customHandler) // pass a custom handler
    .parseAttrFromString(content, { list: ['data-i18n'] }) // override `attr.list`
    .parseAttrFromString(content, { list: ['data-i18n'] }, customHandler)
    .parseAttrFromString(content); // using default options and handler

var translations = { en: parser.get().en.translation, it: parser.get().en.translation };

if (!fs.existsSync('../src/assets/i18n')) fs.mkdirSync('../src/assets/i18n');

const currentEn = JSON.parse(fs.readFileSync('../src/assets/i18n/en.json', 'utf-8'));
const currentIt = JSON.parse(fs.readFileSync('../src/assets/i18n/it.json', 'utf-8'));

fs.writeFileSync('../src/assets/i18n/en.json', JSON.stringify(
    {...translations.en, ...currentEn },
    null, "\t"));
fs.writeFileSync('../src/assets/i18n/it.json', JSON.stringify(
    {...translations.it, ...currentIt },
    null, "\t"));