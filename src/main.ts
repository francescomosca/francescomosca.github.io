// import { Router } from './core';
import './style.scss';
import { $, isDevMode } from './utils';
// import { default as particlesJsConfig } from './assets/particlesjs-config.json';
// import 'particles.js';

export class MainApp {

  constructor(/* public router: Router = new Router() */) {
    // router.renderPage('main');

    // console.log(particlesJsConfig);
    // window['particlesJS']('particles-js', particlesJsConfig);
  }

}

const mainApp = new MainApp();
if (isDevMode) (<any>window).mainApp = mainApp;