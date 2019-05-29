import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router} from '@angular/router'
import { Incidence } from 'src/app/models/incidence';
import { IncidenceService } from 'src/app/services/incidence.service';
import { DamagesService } from '../../services/damages.service';
import { DetailsService } from 'src/app/services/details.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public incidenceArray = [];

  constructor(public AfAuth: AuthService, 
    private router: Router, 
    private incidenceService: IncidenceService,
    private damagesService: DamagesService,
    private detailsService: DetailsService, 
    private vehicleService: VehicleService,
    public db: AngularFirestore) { 
      
    }

  ngOnInit( ) {

    this.incidenceService.getAllIncidence().subscribe(data => {
      this.incidenceArray = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      })
    });
  }

  public OnLogOut(){
    this.AfAuth.logout();
  }

  public IrForm() {
    
    this.damagesService.viewDamageList = false;

    console.log(this.damagesService);
    
    this.router.navigate(['/formulario']);
    this.damagesService = new DamagesService();
  }

  /**
   * Metodo que se ejecuta cuando se pulsa un elemento de la lista de incidencias
   * @param inc 
   */
  goIncident(inc: Incidence) {
    
    this.damagesService.viewDamageList = false;    
    
    switch (inc.state) {
      case 'drawImage':
          this.damagesService.setIncidence(inc);
          this.router.navigate(['/drawimage']);
          this.vehicleService.getVehicle(inc.idCar).subscribe((veh) =>{
            this.damagesService.vehicle = veh.payload.data();
          });
        break;

      case 'damageList':
          this.damagesService.setIncidence(inc);
          this.damagesService.setViewDamageList(true);
          this.router.navigate(['/damagelist']);
          this.vehicleService.getVehicle(inc.idCar).subscribe((veh) =>{
            this.damagesService.vehicle = veh.payload.data();
          });
        break;
    }

  }

  deleteIncidence(inc: Incidence){
    this.incidenceService.deleteIncidence(inc.idInc);
    this.detailsService.deleteDetails(inc.idInc);
  }

}
