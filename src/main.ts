// import { Router } from './core';
import './style.scss';
import { $, isDevMode } from './utils';
import { TranslatorService } from "./services/translator.service";
import Rellax from 'rellax';
import sal from 'sal.js';
import lozad from 'lozad';

export class MainApp {

  constructor(
    public translatorServ: TranslatorService = new TranslatorService()
  ) {
    this.initTranslations();

    // Animation on scroll
    sal({
      threshold: 0.4,
      once: true
    });

    // Parallax
    new Rellax('.parallax', {
      speed: 1,
      center: false,
      wrapper: null,
      round: true,
      vertical: true,
      horizontal: false
    });

    // Lazy-loading for DOM elements
    const observer = lozad('[lazyload]', {
      rootMargin: '10px 0px', // syntax similar to that of CSS Margin
      threshold: 0.1 // ratio of element convergence
    });
    observer.observe();

    // console.log(particlesJsConfig);
    // window['particlesJS']('particles-js', particlesJsConfig);
    // router.renderPage('main');
  }

  async initTranslations() {
    // const browserLang = this.translatorServ.detectLanguage();
    const lang = localStorage.getItem('language') || 'en';
    await this.translatorServ.load(lang);

    const langSel: HTMLInputElement[] = <any>document.querySelectorAll("[name=\"lang-selector\"]");
    console.log(langSel);

    for (const el of langSel) {
      if (el.value === lang) el.classList.add('active');

      const eventHandler = (ev: MouseEvent | KeyboardEvent | Event) => {
        // if ((<KeyboardEvent>ev).keyCode && (<KeyboardEvent>ev).keyCode == 32) ev.preventDefault();
        const newLang = (<any>ev).target.value;
        el.classList.add('loading');
        this.translatorServ.load(newLang)
          .then(() => {
            langSel.forEach(element => element.classList.remove('active'));
            el.classList.add('active');
          })
          .finally(() => el.classList.remove('loading'));
      };

      // langSel.value = browserLang;
      el.addEventListener("click", eventHandler);
      el.addEventListener("keydown", eventHandler);
      // el.addEventListener("change", eventHandler);
    }
  }

}

const mainApp = new MainApp();
if (isDevMode) (<any>window).mainApp = mainApp;