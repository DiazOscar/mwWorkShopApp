import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { Vehicle } from '../models/vehicle';
import { Incidence } from '../models/incidence';
import { Details } from '../models/details';

@Injectable({
  providedIn: 'root'
})
export class DamagesService {

  customer: any;
  vehicle: any;
  private damages = [];
  incidence: Incidence;

  details: Details = {
    id: '',
    damages: [],
    internDamages: []
  };
  
  viewDamageList = false;

  constructor() {
   }

  setViewDamageList(res){
    this.viewDamageList = res;
  }

  getViewDamageList(){
    return this.viewDamageList;
  }

  setDamages(damages) {
    this.damages = damages;
  }

  getDamages() {
    return this.damages;
  }

  setDetails(detail: Details) {
    this.details = detail;
  }

  getDetails() {
    return this.details;
  }

  setIncidence(inc: Incidence){
    this.incidence = inc;
  }

  getIncidence() {
    return this.incidence;
  }

  setCustomer( customer: Customer ){
    this.customer = customer;
  }

  getCustomer(){
    return this.customer;
  }

  setVehicle( vehicle: Vehicle){
    this.vehicle = vehicle;
  }

  getVehicle(){
    return this.vehicle;
  }

}
