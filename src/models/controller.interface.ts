import { IControllerMetadata } from './controller-metadata.interface';
export class IController {
  static metadata?: IControllerMetadata;

  onDestroy?: () => void = () => {};
  // ...
}