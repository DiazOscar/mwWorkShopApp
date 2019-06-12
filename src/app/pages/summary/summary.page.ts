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

    this.canvasElement = this.canvas.nativeElement;
    this.setBackgroundImage();
    this.canvasElement.width = document.body.clientWidth*4/ 5;
    this.canvasElement.height = (document.body.clientHeight*3)/12;
    this.ctx = this.canvasElement.getContext('2d');


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

  setBackgroundImage(){
    let context = this.canvasElement.getContext("2d");

    var background = new Image();
    background.src = this.incidence.imagePath;

    background.onload = function(){
      context.drawImage(background,0,0, document.body.clientWidth*4/5, (document.body.clientHeight*3)/12);   
    }
  }

  async deleteAndCome(){
    const alert = await this.alertCtrl.create({
      header: 'Desea eliminar la incidencia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
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
      'image': this.incidence.imageName,
      'imagePath': this.incidence.imagePath,
      'imageB64': this.incidence.imageB64
    };

    this.damageFService.createIncidence(damage);
    this.incidenceService.deleteIncidence(this.incidence.idInc);
    this.router.navigate(['/menu']);
  }


}
