import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Details } from '../models/details';


@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(private detailsService: AngularFirestore) { }

  getAllDetails() {
    return this.detailsService.collection('details').snapshotChanges();
  }

  getDetail(id: any){
    return this.detailsService.collection('details').doc(id).snapshotChanges();
  }

  createDetails(details: Details){
    return this.detailsService.collection('details').doc(details.id).set(details);
  }

  updateDetails(details: Details){
    this.detailsService.collection('details').doc(details.id).set(details);
  }

  deleteDetails(detailId: string){
    this.detailsService.doc('details/' + detailId).delete();
  }
}
