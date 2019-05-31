import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router, NavigationExtras} from '@angular/router'
import { Incidence } from 'src/app/models/incidence';
import { IncidenceService } from 'src/app/services/incidence.service';
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
    
    this.router.navigate(['/formulario']);
  }

  /**
   * Metodo que se ejecuta cuando se pulsa un elemento de la lista de incidencias
   * @param inc 
   */
  goIncident(inc: Incidence) { 
    console.log(inc);

    let navigationExtras: NavigationExtras = {
      state: {
        incidence: inc
      }
    };
    
    switch (inc.state) {
      case 'drawImage':
        
        this.router.navigate(['/drawimage'], navigationExtras);
      break;

      case 'damageList':
        this.router.navigate(['/damagelist'], navigationExtras);
      break;
    }

  }

  deleteIncidence(inc: Incidence){
    this.incidenceService.deleteIncidence(inc.idInc);
    this.detailsService.deleteDetails(inc.idInc);
  }

}
