export interface TranslatorConfig {
  persist: boolean,
  languages: string[],
  defaultLanguage: string,
  detectLanguage: boolean,
  filesLocation: string,
  attributeName: string
}

const TRANSLATOR_DEFAULT_CONFIG: TranslatorConfig = {
  persist: true,
  languages: ["en", "it"],
  defaultLanguage: "en",
  detectLanguage: true,
  filesLocation: "assets/i18n",
  attributeName: "data-i18n"
};

/** My updated version of simple-translator for TypeScript.
 *  @see https://github.com/andreasremdt/simple-translator/blob/master/src/translator.js */
export class TranslatorService {
  private _elements; // : HTMLElement[] | NodeListOf<Element>;
  private _cache = new Map();

  constructor(private _options: TranslatorConfig = TRANSLATOR_DEFAULT_CONFIG) {
    this._options = { ...TRANSLATOR_DEFAULT_CONFIG, ..._options };
    this._elements = document.querySelectorAll(`[${this._options.attributeName}]`);

    if (this._options.defaultLanguage) this._getResource(this._options.defaultLanguage);
  }

  detectLanguage(): string {
    if (!this._options.detectLanguage) {
      return this._options.defaultLanguage;
    }
    
    if (this._options.persist) {
      const stored = localStorage.getItem("language");
      if (stored) return stored;
    }

    const lang = navigator.languages ? navigator.languages[0] : navigator.language;
    return lang.substr(0, 2);
  }

  async load(lang): Promise<void> {
    if (!this._options.languages.includes(lang)) return;

    this._translate(await this._getResource(lang));

    document.documentElement.lang = lang;

    if (this._options.persist) localStorage.setItem("language", lang);

  }

  async getTranslationByKey(lang, key) {
    if (!key) throw new Error("Expected a key to translate, got nothing.");

    if (typeof key != "string") throw new Error(
      `Expected a string for the key parameter, got ${typeof key} instead.`
    );

    const translation = await this._getResource(lang);

    return this._getValueFromJSON(key, translation);
  }

  private async _fetch(path: string): Promise<Object | null> {
    try {
      const res: Response = await fetch(path);
      return res.json();
    } catch /* (error) */ {
      console.error(`Could not load ${path}. Please make sure that the file exists.`);
      return null;
    }
  }

  private async _getResource(lang: string) {
    if (this._cache.has(lang))  return JSON.parse(this._cache.get(lang));

    var translation = await this._fetch(`${this._options.filesLocation}/${lang}.json`);
    if (!this._cache.has(lang)) this._cache.set(lang, JSON.stringify(translation));

    return translation;
  }

  private _getValueFromJSON(key: string | null, json: Object) {
    var text = key?.split(".").reduce((obj, i) => obj[i], json);

    if (!text && text !== '' && this._options.defaultLanguage) {
      let fallbackTranslation = JSON.parse(
        this._cache.get(this._options.defaultLanguage)
        );

      text = this._getValueFromJSON(key, fallbackTranslation);
    }

    return text;
  }

  private _translate(translation: Object): void {
    const replaceFn = (element: HTMLElement) => {
      const key = element.getAttribute("data-i18n");
      const property = element.getAttribute("data-i18n-attr") || "innerHTML";
      const text = this._getValueFromJSON(key, translation);

      if (text) element[property] = text;
      else {
        element[property] = element.dataset.i18n;
        console.warn(`Could not find text for attribute "${key}".`);
      }

    };

    this._elements.forEach(replaceFn);
  }

}
