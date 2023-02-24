import { FitokData } from './../fitokData.model';
import { FitokDatasDescriptorInterface } from './../../../config/network/api.descriptors';
export class FitokDatasFactory{
  static create(descriptor: FitokDatasDescriptorInterface): FitokData{

    const instance: FitokData = new FitokData();
    const keysToDuplicate = [
      'id',
      'fitok',
      'dateStartProduction',
      'dateEndProduction',
      'dateDelivery',
      'sellingPrice',
      'ddt',
      'type',
      'material',
      'length',
      'width',
      'height',
      'assembly',
      'tare',
      'net',
      'gross',
      'quantity',
      'firCm',
      'plywoodCm',
      'osbCm',
      'totalCm'
    ];
    keysToDuplicate.forEach(key => instance[key] = descriptor[key]);


    return instance;
  }
}
