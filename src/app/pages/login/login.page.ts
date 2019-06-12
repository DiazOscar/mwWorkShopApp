import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  mail: string;
  password: string;

  constructor(private authService: AuthService, public router: Router, public toastCtrl: ToastController) {  }

  ngOnInit() {

  }

  async login() {
    const { mail, password } = this;
    try {
      return new Promise((resolve, rejected) => {
        console.log(mail);
        this.authService.getAngularFireAuth().signInWithEmailAndPassword(mail, password).then(user => {
          resolve(user);
          this.router.navigate(['/menu']);
        }).catch(async err => {
          console.dir(err);
          const toast = await this.toastCtrl.create({
            message: err + '',
            color: 'light',
            duration: 2000,
            mode: 'ios',
            cssClass: 'toastcss',
          });

          toast.present();
        }
        )
      });
    } catch (err) {

    }
  }

}
