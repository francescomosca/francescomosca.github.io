import { IController } from './models/controller.interface';
import { join } from 'path';
export class Router {
  private _entryPointEl: HTMLElement;

  private _currentPageInstance: IController | null = null;

  constructor(private _entryPointName = 'app-root') {
    this._entryPointEl = <HTMLElement>document.getElementsByTagName(this._entryPointName)[0];
    if (this._entryPointEl === undefined) throw new Error('Nessun tag d\'entrata trovato');
  }

  /* private _getTemplate(pageName): string {
    try {
      const template = require(`./pages/${pageName}.template.html`);
      return template; // return removeModuleExports(template);
    } catch (err) {
      throw new Error(`Pagina ${pageName} non trovata`);
    }
  } */
  private _getTemplateFromCtrl(ctrl: typeof IController | any, pageName: string): string {
    const relativeTplPath = ctrl.metadata?.templateUrl;
    if (relativeTplPath === null || relativeTplPath === undefined) throw new Error(`${ctrl.name} non ha un templateUrl definito`);
    try {
      const tplPath = join('pages', pageName, relativeTplPath);
      const template = require('./' + tplPath);
      return template; // return removeModuleExports(template);
    } catch (err) {
      throw new Error(`Template di ${ctrl.name} non trovato`);
    }
  }

  private async _getController(pageName): Promise<typeof IController> {
    try {
      const ctrlPath = join('pages', pageName, `${pageName}.controller`);
      const controller = (await import('./'+ctrlPath)).default; // require(ctrlPath).default;
      return controller; // return removeModuleExports(template);
    } catch (err) {
      throw new Error(`Controller ${pageName} non trovato\n` + err);

    }
  }

  async renderPage(pageName: string = 'main'): Promise<void> {

    const ctrl: typeof IController = await this._getController(pageName);
    const template = this._getTemplateFromCtrl(ctrl, pageName);

    this._entryPointEl.innerHTML = template;
    this._currentPageInstance = new ctrl();
  }

}
