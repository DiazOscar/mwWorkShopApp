import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Customer} from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private firestore: AngularFirestore) {   }

  getAllCustomer() {
    return this.firestore.collection('customers').snapshotChanges();
  }

  getCustomer(nif: any) {
    return this.firestore.collection('customers').doc(nif).snapshotChanges();
  }

  createCustomer(customer: Customer) {
    return this.firestore.collection('customers').doc(customer.nif).set(customer);

  }

  updateCustomer(customer: Customer) {
    this.firestore.collection('customers').doc(customer.nif).set(customer);
  }

}
