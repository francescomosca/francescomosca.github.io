import { Router } from './core';
import './style.scss';
import { $, isDevMode } from './utils';

export class MainApp {

  constructor(public router: Router = new Router()) {
    router.renderPage('main');
  }

}

const mainApp = new MainApp();
if (isDevMode) (<any>window).mainApp = mainApp;

/*
const ratio = 50;
addEventListener("mousemove", (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY));

function updatePosition(x: number, y: number, el: HTMLElement = <any>$('.big-f')) {
  const points = {
    x: x * ratio / 100, // y: y * ratio / 100
  };
  const pointsPercent = { x: window.innerHeight / points.x * 100 };
  // el.style.top = points.x + "px";

  // const halfElement = (el.clientWidth / 2);
  // el.style.marginLeft = halfElement + 'px';

  // let left = window.innerWidth - points.x - halfElement;
  // left += (window.innerHeight * ratio / 100);
  el.style.left = pointsPercent.x + '%';
}
*/