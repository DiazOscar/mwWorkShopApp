import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/interfaces/Constants';


@Injectable({
  providedIn: 'root'
})
/**
 * Servicio el cual me recoge los datos de los archivos json
 */
export class DataService {

  constructor( private http: HttpClient) { }

  /**
   * Metodo que me devuelve los datos del archivo ConstantsVehicles.json
   */
  getConstantVehicles(){
    return this.http.get<Constants[]>('/assets/data/ConstantVehicles.json');
  }

  /**
   * Metodo que me devuelve los datos del archivo ConstantsVehicles.json
   */
  getConstantCustomers(){
    return this.http.get<Constants[]>('/assets/data/ConstantCustomers.json');
  }

  getValidationMessageCustomers() {
    return this.http.get('/assets/data/ValidationMessageCustomers.json');
  }
}
