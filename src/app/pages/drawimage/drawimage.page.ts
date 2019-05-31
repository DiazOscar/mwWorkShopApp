import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Incidence } from 'src/app/models/incidence';
import { IncidenceService } from 'src/app/services/incidence.service';
import { finalize} from 'rxjs/operators'
import { DetailsService } from '../../services/details.service';
import { Details } from '../../models/details';
import { NavController } from '@ionic/angular';

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
  public myForm: FormGroup;
  public averias = [];
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


  constructor(private formBuilder: FormBuilder,
    public detailsService: DetailsService,
    private storageAng: AngularFireStorage,
    private incidenceService: IncidenceService,
    private route: ActivatedRoute,
    private router: Router) {

    this.myForm = formBuilder.group({ });

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.incidence = this.router.getCurrentNavigation().extras.state.incidence;
      }
    });

    console.log(this.incidence);
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
  }

  goDamageList() {
    this.insertDamagesDetails();
    this.saveCanvasImage();
    let navigationExtras: NavigationExtras = {
      state: {
        incidence: this.incidence
      }
    };
    this.router.navigate(['/damagelist'], navigationExtras);
  }

  insertDamagesDetails() {
    this.details.id = this.incidence.idInc;
    this.details.damages = this.averias;
    this.detailsService.createDetails(this.details);
  }

  returnMenu() {
    this.router.navigate(['/menu']);
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
    let url = '';
    let name =this.incidence.idInc + '.png';

    let dataURL = this.canvasElement.toDataURL('image/png', 0.5);
    let blob = this.dataURItoBlob(dataURL);

    this.ref = this.storageAng.ref(name);
    this.task = this.storageAng.ref(name).put(blob);

    this.task
      .snapshotChanges()
      .pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(data => {
          url = data;
          this.incidence.imageName = name;
          this.incidence.imagePath = url;
          if (this.goMenu) {
            /**Si en la vista pulsas el boton volver te setea el estado de la incidencia a drawImage, si
             * es el de continuar de continuar a damageList para que luego en el menu sepa hacia donde volver.
             */
            this.incidence.state = 'drawImage';
          } else {
            this.incidence.state = 'damageList';
          }
          this.incidenceService.updateIncidence(this.incidence);
        });
      })
      )
      .subscribe();
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

  handleStart(ev) {

    ev.preventDefault();
    ev.stopPropagation();

    this.startX = ev.touches[0].clientX - this.canvasElement.offsetLeft;
    this.startY = ev.touches[0].clientY - this.canvasElement.offsetTop;

    this.addControl();
    this.drawCircle(this.startX, this.startY, this.touches.length);
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
    this.myForm = this.formBuilder.group({});
    this.averias = [];
    this.touches = [];

    this.setBackgroundImage(this.ctx);
  }

  addControl() {

    if (this.touches.length == 0) {
      this.myForm.addControl(String(0), new FormControl('', Validators.required));
      this.touches.push({
        "id": 0,
        "x": this.startX,
        "y": this.startY,
        "form": 0
      });
    } else {
      this.myForm.addControl(String(this.touches[this.touches.length - 1].form + 1), new FormControl('', Validators.required));

      this.touches.push({
        "id": this.touches[this.touches.length - 1].id + 1,
        "x": this.startX,
        "y": this.startY,
        "form": this.touches[this.touches.length - 1].form + 1
      });
    }
    console.log(this.myForm);
    console.log(this.touches);
  }

  removeControl(control) {
    this.myForm.removeControl(control.key);

    for (let i = 0; i < this.touches.length; i++) {

      if (control.key == this.touches[i].form) {
        this.touches.splice(i, 1);
        this.averias.splice(i, 1);
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        i--;
      } else {
        this.touches[i].id = i;
      }
    }

    this.setBackgroundImage(this.ctx);

    setTimeout(() => {
      for (let i = 0; i < this.touches.length; i++) {
        this.drawCircle(this.touches[i].x, this.touches[i].y, i + 1);
      }
    }, 350);
  }

  checkValue(control: string): boolean {
    let number: number = parseInt(control);
    if (number >= (this.touches.length - 1)) {
      return true;
    } else {
      return false;
    }
  }

}
