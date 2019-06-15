import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Incidence } from 'src/app/models/incidence';
import { IncidenceService } from 'src/app/services/incidence.service';
import { finalize } from 'rxjs/operators'
import { DetailsService } from '../../services/details.service';
import { Details } from '../../models/details';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-drawimage',
  templateUrl: './drawimage.page.html',
  styleUrls: ['./drawimage.page.scss'],
})
export class DrawimagePage implements OnInit {
  //Atributes
  @ViewChild('myCanvas') canvas: any;
  canvasElement: any;
  startX: any;
  startY: any;
  isDown = false;
  ctx: any;
  //public myForm: FormGroup;
  public touches = [];
  downloadURL: Observable<any>;
  task: AngularFireUploadTask;
  ref: AngularFireStorageReference;
  incidence: Incidence;
  details: Details = {
    id: '',
    damages: [],
    internDamages: []
  };
  goMenu: Boolean = false;

  constructor(public detailsService: DetailsService,
    private storageAng: AngularFireStorage,
    private incidenceService: IncidenceService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.incidence = this.router.getCurrentNavigation().extras.state.incidence;
        console.log('INCIDENCIA ', this.incidence);
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

    console.log(this.canvas);
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.style.background = "url(../../assets/img/coche-pro.jpg)";
    this.canvasElement.style.backgroundRepeat = "no-repeat";
    this.canvasElement.style.backgroundSize = "100% 100%";
    this.canvasElement.width = document.body.clientWidth - 6;
    this.canvasElement.height = (document.body.clientHeight * 3) / 7;
    this.ctx = this.canvasElement.getContext('2d');
    this.setBackgroundImage(this.ctx);

    try {
      setTimeout(() => {
        this.detailsService.getDetail(this.incidence.idInc).subscribe((damSnapshot) => {
          if (damSnapshot.payload.get('id') == undefined) {
            return;
          }
          this.details.id = damSnapshot.payload.get('id');
          this.details.damages = damSnapshot.payload.get('damages');
          this.details.internDamages = damSnapshot.payload.get('internDamages');
          console.log(this.details);

          this.touches = this.details.damages;
          for (let i = 0; i < this.touches.length; i++) {
            this.drawCircle(this.touches[i].x, this.touches[i].y, i + 1);
          }
        });
      }, 350);
    } catch (err) {

    }

    console.log(this.touches);
  }

  async goDamageList() {
    console.log(this.checkEmpty())
    if (this.checkEmpty()) {
      this.insertDamagesDetails();
      this.saveCanvasImage();
      let navigationExtras: NavigationExtras = {
        state: {
          incidence: this.incidence
        }

      };
      this.router.navigate(['/damagelist'], navigationExtras);
    }else{
      this.alert("No campos vacios")
    }

  }

  insertDamagesDetails() {
    this.details.id = this.incidence.idInc;
    this.details.damages = this.touches;
    this.detailsService.createDetails(this.details);
  }

  returnMenu() {
    if(this.checkEmpty()){
      this.incidence.state = 'drawImage';
      this.incidenceService.updateIncidence(this.incidence);
      this.insertDamagesDetails();
  
      this.router.navigate(['/menu']);      
    }else{
      this.alert("No campos vacios")
    }
  }

  /**
   * Si el imagePath tiene valor me carga la imagen correspondiente de la incidencia
   * @param context 
   */
  async setBackgroundImage(context) {
    var background = new Image();
    background.src = "../../assets/img/coche-pro.jpg";
    background.onload = await function () {
      context.drawImage(background, 0, 0, document.body.clientWidth - 6, (document.body.clientHeight * 3) / 7);
    }

  }

  async saveCanvasImage() {

    let dataURL = this.canvasElement.toDataURL('image/png', 0.5);
    this.incidence.imageB64 = dataURL;

    if (this.goMenu) {
      /**Si en la vista pulsas el boton volver te setea el estado de la incidencia a drawImage, si
       * es el de continuar de continuar a damageList para que luego en el menu sepa hacia donde volver.
       */
      this.incidence.state = 'drawImage';
    } else {
      this.incidence.state = 'damageList';
    }

    console.log(this.incidence)
    this.incidenceService.updateIncidence(this.incidence);

  }

  async handleStart(ev) {
    console.log(this.touches.length)
    if (this.touches.length < 10) {
      ev.preventDefault();
      ev.stopPropagation();

      this.startX = ev.touches[0].clientX - this.canvasElement.offsetLeft;
      this.startY = ev.touches[0].clientY - this.canvasElement.offsetTop;

      this.addControl();
      this.drawCircle(this.startX, this.startY, this.touches.length);
    } else {
      this.alert("Maximo 10 averias")
    }

  }

  drawCircle(x, y, id?) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 35, 0, 2 * Math.PI);
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    this.ctx.font = "30px sans-serif";
    this.ctx.fillStyle = "#FF0000";
    if (id != null) {
      if (id < 9) {
        this.ctx.fillText(id, x - 6, y + 6);
      } else {
        this.ctx.fillText(id, x - 15, y + 6);
      }
    } else {
      this.ctx.fillText(1, x - 6, y + 6);
    }

    this.ctx.closePath();

  }

  clearAll() {
    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.touches = [];
    this.setBackgroundImage(this.ctx);
  }

  addControl() {

    this.touches.push({
      "x": this.startX,
      "y": this.startY,
      "info": ''
    });

  }

  removeControl(id) {
    console.log(id)
    this.touches.splice(id.key, 1);
    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    this.setBackgroundImage(this.ctx);

    setTimeout(() => {
      for (let i = 0; i < this.touches.length; i++) {
        this.drawCircle(this.touches[i].x, this.touches[i].y, i + 1);
      }
    }, 350);
  }

  checkEmpty(): boolean {
    let check = true;
    for (let damage of this.touches) {
      console.log(damage.info.length)
      if (damage.info.length == 0) {
        check = false;
        return check;
      }
    }

    return check;
  }

  async alert(message){
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
