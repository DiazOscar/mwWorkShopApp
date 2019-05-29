import { Component, OnInit } from '@angular/core';
import { DamagesService } from 'src/app/services/damages.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DetailsService } from '../../services/details.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-damagelist',
  templateUrl: './damagelist.page.html',
  styleUrls: ['./damagelist.page.scss'],
})
export class DamagelistPage implements OnInit {

  damages = [];
  internDamage = [];

  public count = 0;
  public myForm: FormGroup;
  public forms = [];

  constructor(public damageService: DamagesService, 
    public detailsService: DetailsService,
    private formBuilder: FormBuilder,
    private navCtrl:NavController) { 

    this.myForm = this.formBuilder.group({

        });

    this.damages = [];
    this.internDamage = [];
    if(!this.damageService.viewDamageList){      
    this.damageService.details.internDamages.length = 0;
    }
  }

  ngOnInit() {
    /**Compruebo el booleano de damageServices ya que si esta a true significa que 
     * hemos accedido seleccionando el item del menu y si esta a false es que se ha accedido
     * desde la vista drawImage al darle a continuar.
     */
    
    if (this.damageService.getViewDamageList()) {
      this.detailsService.getDetail(this.damageService.incidence.idInc).subscribe( (damSnapshot) => {
        this.damageService.details.id = damSnapshot.payload.get('id');
        this.damageService.details.damages = damSnapshot.payload.get('damages');
        this.damageService.details.internDamages = damSnapshot.payload.get('internDamages');

        this.damages = damSnapshot.payload.get('damages');
        this.internDamage = damSnapshot.payload.get('internDamages');
        
        for(let c of this.internDamage){
          this.addControl();
        }
      });
    } else {
      this.damages = this.damageService.getDamages();
    }
  }

  addControl(){
    if(this.count < 10){
      this.myForm.addControl('0'+(this.count), new FormControl('', Validators.required));
      this.forms.push({
        "form": '0'+(this.count)
      })
      this.count ++;
    }else{
      this.myForm.addControl(String(this.internDamage.length), new FormControl('', Validators.required));
      this.forms.push({
        "form": this.count
      })
      this.count ++;
    }    

    console.log(this.internDamage);
  }

  removeControl(control){
    this.myForm.removeControl(control.key);

    for (let i = 0; i < this.forms.length; i++) {
      if(this.forms[i].form == control.key){
        this.internDamage.splice(i, 1);
        this.forms.splice(i, 1);
      }
    }    
  }

  goSummary( ){
    this.addInternalDamages();
    this.damageService.setDamages(this.damages.concat(this.internDamage));
    this.navCtrl.navigateForward(['/summary']);
    console.log(this.damages);
  }

  addInternalDamages() {
    this.damageService.details.internDamages = this.internDamage;
    this.detailsService.updateDetails(this.damageService.details);
  }

  comeback(){
    this.damageService.incidence.idInc = '';
    this.navCtrl.pop();
  }

}
