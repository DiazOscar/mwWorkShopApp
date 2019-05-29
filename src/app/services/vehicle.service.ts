import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Vehicle } from '../models/vehicle';



@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private firestore: AngularFirestore) {   }

  checkEnrollment(vehicle: Vehicle) {
    const usersCollection = this.firestore.collection('vehicles').doc(vehicle.enrollment).get().toPromise().then(function(data){
      if(data.exists){
        vehicle.enrollment = data.get('enrollment');
        vehicle.brand = data.get('brand');
        vehicle.model = data.get('model');
        vehicle.kilometers = data.get('kilometers');
        vehicle.color = data.get('color');
        vehicle.year = data.get('year');
      } else{
        console.log('no existe');
      }
    });
   }

  getAllVehicle() {
    return this.firestore.collection('vehicles').snapshotChanges();
  }

  getVehicle(enrollment){
    return this.firestore.collection('vehicles').doc(enrollment).snapshotChanges();
  }

  createVehicle(vehicle: Vehicle){
    vehicle.year = vehicle.year.substring(0, 4);
    return this.firestore.collection('vehicles').doc(vehicle.enrollment).set(vehicle);
  }

  updateVehicle(vehicle: Vehicle){
    vehicle.year = vehicle.year.substring(0, 4);
    this.firestore.collection('vehicles').doc(vehicle.enrollment).set(vehicle);
  }
  
}
