import { IController } from '../../models/controller.interface';

export default class MainPage implements IController {
  static metadata = {
    templateUrl: './main.template.html'
  }

  constructor() { }

}