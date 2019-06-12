import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth"
import { promise } from 'protractor';
import { resolve } from 'url';
import {Router} from "@angular/router"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private AFAuth: AngularFireAuth, private router: Router) { 
    
  }

  getAngularFireAuth(){
    return this.AFAuth.auth;
  }
  login(email:string, password:string){

      return new Promise((resolve, rejected) => {
        this.AFAuth.auth.signInWithEmailAndPassword(email, password).then(user=>{
                resolve(user)

              }).catch(err => rejected(err))
      });
  }

  logout(){
    this.AFAuth.auth.signOut().then(auth => {
      this.router.navigate(['/login']);
    });
  }
}
