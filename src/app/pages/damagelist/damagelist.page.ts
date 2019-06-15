import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DetailsService } from '../../services/details.service';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras, PRIMARY_OUTLET } from '@angular/router';
import { Incidence } from 'src/app/models/incidence';
import { Details } from 'src/app/models/details';

@Component({
  selector: 'app-damagelist',
  templateUrl: './damagelist.page.html',
  styleUrls: ['./damagelist.page.scss'],
})
export class DamagelistPage implements OnInit {

  incidence: Incidence;
  details: Details = {
    id: '',
    damages: [],
    internDamages: []
  };

  public count = 0;
  public myForm: FormGroup;
  public forms = [];

  constructor(public detailsService: DetailsService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private alertControler: AlertController,
    private toastCtrl: ToastController) {

    this.myForm = this.formBuilder.group({});

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.incidence = this.router.getCurrentNavigation().extras.state.incidence;
      }
      console.log('DAMAGE LIST INCIDENCIA', this.incidence);
    });
  }

  ngOnInit() {
    /**Compruebo el booleano de damageServices ya que si esta a true significa que 
     * hemos accedido seleccionando el item del menu y si esta a false es que se ha accedido
     * desde la vista drawImage al darle a continuar.
     */
    this.detailsService.getDetail(this.incidence.idInc).subscribe((damSnapshot) => {
      this.details.id = damSnapshot.payload.get('id');
      this.details.damages = damSnapshot.payload.get('damages');
      this.details.internDamages = damSnapshot.payload.get('internDamages');

      console.log(this.details);
      for (let c of this.details.internDamages) {
        this.addControl();
      }
    });
  }

  addControl() {
    if (this.count < 10) {
      this.myForm.addControl('0' + (this.count), new FormControl('', Validators.required));
      this.forms.push({
        "form": '0' + (this.count)
      });
      this.count++;
    } else {
      this.myForm.addControl(String(this.details.internDamages.length), new FormControl('', Validators.required));
      this.forms.push({
        "form": this.count
      });
      this.count++;
    }

    console.log(this.details.internDamages);
  }

  removeControl(control) {
    this.myForm.removeControl(control.key);

    for (let i = 0; i < this.forms.length; i++) {
      if (this.forms[i].form == control.key) {
        this.details.internDamages.splice(i, 1);
        this.forms.splice(i, 1);
      }
    }
  }

  checkListInternDamages(details: Details): Boolean {
    let resp: Boolean = false;
    if (details.damages.length == 0) {
      console.log('AVERIAS EXTERNAS ESTA VACIA');
      if (details.internDamages.length < 1) {
        console.log('AVERIAS INTERNAS TIENE QUE ESTAR RELLENO');
        resp = false;
      } else {
        resp = true;
      }
    } else {
      console.log('AVERIAS EXTERNAS TIENE DATOS');
      resp = true;
    }
    return resp;
  }

  goSummary(details: Details) {

    if (this.checkListInternDamages(details)) {
      if (this.checkEmpty()) {
        this.addInternalDamages();
        let navigationExtras: NavigationExtras = {
          state: {
            incidence: this.incidence
          }
        };
        this.router.navigate(['/summary'], navigationExtras);
      } else {
        this.alert("No campos vacios")
      }
    } else {
      this.alertCheckDamages();
    }
  }

  async alertCheckDamages() {

    const alert = await this.alertControler.create({
      animated: true,
      header: 'Lista de averias vacia',
      message: 'Los datos de la averia no pueden estar vacios. Introduzca datos',
      buttons: [
        {
          text: 'Volver averias de carroceria',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: () => {
            let navigationExtras: NavigationExtras = {
              state: {
                incidence: this.incidence
              }
            };
            this.router.navigate(['/drawimage'], navigationExtras);
          }
        }, {
          text: 'Quedarse aqui',
          role: 'aceptar',
          cssClass: 'primary',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  addInternalDamages() {
    this.detailsService.updateDetails(this.details);
  }

  comeback() {
    if (this.checkEmpty()) {
      this.addInternalDamages();
      this.router.navigate(['/menu']);
    } else {
      this.alert("No campos vacios")
    }

  }

  goDraw() {
    if (this.checkEmpty()) {
      this.addInternalDamages();
      let navigationExtras: NavigationExtras = {
        state: {
          incidence: this.incidence
        }
      };
      this.router.navigate(['/drawimage'], navigationExtras);
    } else {
      this.alert("No campos vacios")
    }

  }

  checkEmpty(): boolean {
    console.log(this.details.internDamages)
    let check = true;
    for (let damage of this.details.internDamages) {
      if (damage == undefined || damage.length == 0) {
        check = false;
        return check;
      }
    }

    return check;
  }

  async alert(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      color: "light",
      duration: 2000,
      mode: "ios",
      cssClass: "toastcss",
    });

    toast.present();
  }

}
