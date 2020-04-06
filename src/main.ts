// import { Router } from './core';
import './style.scss';
import { $, isDevMode } from './utils';
import { TranslatorService } from "./services/translator.service";
// import 'particles.js';

export class MainApp {

  constructor(
    public translatorServ: TranslatorService = new TranslatorService()
  ) {
    this.initTranslations();

    // router.renderPage('main');

    // console.log(particlesJsConfig);
    // window['particlesJS']('particles-js', particlesJsConfig);
  }

  initTranslations() {
    // const browserLang = this.translatorServ.detectLanguage();
    this.translatorServ.load('en');

    const langSel: HTMLInputElement[] = <any>document.querySelectorAll("[name=\"lang-selector\"]");
    console.log(langSel);

    for (const el of langSel) {
      if (el.value === 'en') el.classList.add('active');
      // langSel.value = browserLang;
      el.addEventListener("change", (ev: any) => {
        const newLang = ev.target.value;
        el.classList.add('loading');
        this.translatorServ.load(newLang)
          .then(() => {
            langSel.forEach(element => element.classList.remove('active'));
            el.classList.add('active');
          })
          .finally(() => el.classList.remove('loading'));
      });
    }
  }

}

const mainApp = new MainApp();
if (isDevMode) (<any>window).mainApp = mainApp;