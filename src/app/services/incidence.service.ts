import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { Incidence } from '../models/incidence';
 
@Injectable({
  providedIn: 'root'
})
export class IncidenceService {

  constructor(private firestore: AngularFirestore) {
  }

  getAllIncidence() {
    return this.firestore.collection('incidents').snapshotChanges();
  }

  getIncidence(incidence: Incidence){
    return this.firestore.collection('incidents').doc(incidence.idInc).snapshotChanges();
  }

  createIncidence(incidence: Incidence){
    return this.firestore.collection('incidents').doc(incidence.idInc).set(incidence);
  }

  updateIncidence(incidence: Incidence){
    return this.firestore.collection('incidents').doc(incidence.idInc).update(incidence);
  }

  deleteIncidence(incidenceId: string){
    this.firestore.doc('incidents/' + incidenceId).delete();
  }
  
}