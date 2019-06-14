import { Component, OnInit, ViewChild } from '@angular/core';
import { Incidence } from 'src/app/models/incidence';
import { VehicleService } from 'src/app/services/vehicle.service';
import { CustomerService } from 'src/app/services/customer.service';
import { IncidenceService } from 'src/app/services/incidence.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DetailsService } from 'src/app/services/details.service';
import { DamageFService } from 'src/app/services/damage-f.service';
import { Details } from 'src/app/models/details';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

  
  public id: string;
  public customer: any;
  public vehicle: any;
  details: Details ={
    id: '',
    damages: [],
    internDamages: []
  };
  public incidence: Incidence;

  @ViewChild('myCanvas') canvas: any;
  canvasElement: any;
  ctx;
  x: any;

  constructor(private detailsService: DetailsService,
              private vehicleService: VehicleService,
              private customerService: CustomerService,
              private incidenceService: IncidenceService,
              private router: Router,
              private route: ActivatedRoute,
              private alertCtrl: AlertController, 
              private damageFService: DamageFService) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.incidence = this.router.getCurrentNavigation().extras.state.incidence;
      }
    });

    
  }

  ngOnInit() {

    this.detailsService.getDetail(this.incidence.idInc).subscribe( (damSnapshot) => {
      this.details.id = damSnapshot.payload.get('id');
      this.details.damages = damSnapshot.payload.get('damages');
      this.details.internDamages = damSnapshot.payload.get('internDamages');
    });


    this.vehicleService.getVehicle(this.incidence.idCar).subscribe((veh) =>{
       this.x = veh.payload.data()
       console.log(this.x);
    });

    setTimeout(() => {
      this.customerService.getCustomer(this.x.owner).subscribe((cus) =>{
        this.customer = cus.payload.data()
        console.log(this.customer);
      })
    }, 350);

    console.log('INCIDENCIA SUMMARY',this.incidence);
    console.log('CUSTOMER',this.customer);
  }

  async deleteAndCome(){
    const alert = await this.alertCtrl.create({
      header: 'Desea eliminar la incidencia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Eliminar',
          handler: () => {
            this.incidenceService.deleteIncidence(this.incidence.idInc);
            this.detailsService.deleteDetails(this.incidence.idInc);
            this.router.navigate(['/menu']);
          }
        }
      ]});    

      await alert.present();
  }

  cancelAndCome(){
    this.router.navigate(['/menu']);
  }

  okey(){

    let damage = {
      'id': this.incidence.idInc,
      'car': this.incidence.idCar,
      'date': this.incidence.date,
      'imageB64': this.incidence.imageB64
    };

    this.damageFService.createIncidence(damage);
    this.incidenceService.deleteIncidence(this.incidence.idInc);
    this.router.navigate(['/menu']);
  }


}
