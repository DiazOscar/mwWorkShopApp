import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
import { NavController, LoadingController, AlertController, IonItem } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder, NgControlStatus } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
import { DataService } from '../../services/data.service';
import { Constants } from 'src/app/interfaces/Constants';
import { Observable, empty } from 'rxjs';
import { IncidenceService } from '../../services/incidence.service';
import { Incidence } from '../../models/incidence';
import { Vehicle } from 'src/app/models/vehicle';
import { ElementRef, ViewChild, AfterViewInit } from '@angular/core';



@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage implements OnInit {

  @ViewChild( 'miSelect' ) miSelect: ElementRef;

  /* Atributos de la clase */
  formGroupCustomers: FormGroup;

  formGroupVehicles: FormGroup;

  customer: Customer = {
    nif: '',
    name: '', 
    phone: '', 
    address: '',
    email: ''
  };

  vehicle: Vehicle = {
    enrollment: '',
    brand: '',
    model: '',
    kilometers: '',
    color: '',
    year:'',
    owner: ''
  };

  incidence: Incidence = {
    idInc: '',
    idCar: '', 
    state: '',
    imageName: '',
    imagePath: '',
    imageB64: '',
    date: ''
  };

  existCustomer: Boolean = false;

  customerDoc;
  vehicleDoc;

    /*Estos son los mensajes de error que saldran si el usuario inserta un dato incorrecto,
      Dependiendo del dato mal introducido saltara un mensaje u otro.*/
  validation_messages_customers = {
    'name': [
        { type: 'required', message: 'El Nombre es un dato obligatorio.' },
      ],
        'nif': [
          { type: 'pattern', message: 'El Nif son 8 números y 1 letra' },
          { type: 'required', message: 'El Nif es un dato Obligatorio.' }
        ],
        'phone': [
          { type: 'required', message: 'Introduzca un número de telefono.' },
          { type: 'pattern', message: 'Un número de telefono tiene 9 digitos y empieza por 9,6 o 7s' }
        ],
        'address': [
          { type: 'required', message: 'Introduzca una direccion.' }
        ],
        'email': [
          { type: 'required', message: 'Introduzca un email.' },
          { type: 'pattern', message: 'Introduzca un email valido' }
        ]
  };

  validation_messages_vehicles = {
        'enrollment': [
            { type: 'required', message: 'Introduce la matricula.' },
            { type: 'pattern', message: 'Introduzca una matricula correcta' }
          ],
          'brand': [
            { type: 'required', message: 'Introduce la marca del coche' },
            { type: 'pattern', message: 'Introduce la marca' },
          ],
          'model': [
            { type: 'required', message: 'Introduce el modelo del coche' },
            { type: 'pattern', message: 'Introduce un número de teléfono correcto' }
          ],
          'kilometers': [
            { type: 'required', message: 'Introduce los kilometros.' },
            { type: 'pattern', message: 'Solo números' }
          ],
          'color': [
            { type: 'required', message: 'Introduce el color' }
          ],
          'year': [
            { type: 'required', message: 'Introduce el año del coche' },
            { type: 'pattern', message: 'Solo números de dos cifras' }
          ]
  };

  constantCustomers: Observable<Constants[]>;

  constantVehicles: Observable<Constants[]>;

  constantMessagesErrors: Observable<Object>;

  customerArray = [];
  vehicleArray = [];
  auxVehicleArray = [];
  incidenceArray = [];

  /*Dentro del constructor inicializo mi FormGroup(es un conjunto de form Control) y le aplico ciertos
  parametros para validar*/
  constructor(private route: ActivatedRoute,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private dataService: DataService,
    public alertController: AlertController,
    public incidenceService: IncidenceService,
    private router: Router,) {
      this.buildFormGroupCustomers();
      this.buildFormGroupVehicles();
  }

  ngOnInit() {
    //set data to arrays

    this.customerService.getAllCustomer().subscribe((custSnapshot) => {
      this.customerArray = [];
      custSnapshot.forEach((custData: any)=> {
        this.customerArray.push({
          id: custData.payload.doc.id,
          data :custData.payload.doc.data()
        });
      });
    });

    this.vehicleService.getAllVehicle().subscribe((vehSnapshot) => {
      this.vehicleArray = [];
      vehSnapshot.forEach((vehData: any)=> {
        this.vehicleArray.push({
          id: vehData.payload.doc.id,
          data: vehData.payload.doc.data()
        });
      })
    });

    this.incidenceService.getAllIncidence().subscribe((incSnapshot) => {
      this.incidenceArray = [];
      incSnapshot.forEach((incData: any)=> {
        this.incidenceArray.push({
          id: incData.payload.doc.id,
          data :incData.payload.doc.data()
        });
      })
    });
    /*Recojo los datos del json y los guardo en estas variables*/
    this.constantVehicles = this.dataService.getConstantVehicles();
    this.constantCustomers = this.dataService.getConstantCustomers();

    //COMPROBAR BIEN DATOS - JSON ERROR MESSAGE
  }

  public getErrorCustomers(controlName: string): string {
    let error = '';
    const control = this.formGroupCustomers.get(controlName);

    switch (controlName) {
      case 'nif': {
          this.validation_messages_customers.nif.forEach( res => {
            if (control.hasError(res.type)) {
                error = res.message;
            }
          });
        break;
      }
      case 'name': {
        this.validation_messages_customers.name.forEach( res => {
          if (control.hasError(res.type)) {
              error = res.message;
          }
        });
        break;
      }
      case 'phone': {
        this.validation_messages_customers.phone.forEach( res => {
          if (control.hasError(res.type) ) {
              error = res.message;
          }
        });
        break;
      }
      case 'address': {
        this.validation_messages_customers.address.forEach( res => {
          if (control.hasError(res.type)) {
              error = res.message;
          }
        });
        break;
      }
      case 'email': {
        this.validation_messages_customers.email.forEach( res => {
          if (control.hasError(res.type)) {
              error = res.message;
          }
        });
        break;
      }
    }
    return error;
  }

  public getErrorVehicles(controlName: string): string {
    let error = '';
    const control = this.formGroupVehicles.get(controlName);

    switch (controlName) {
      case 'enrollment': {
        this.validation_messages_vehicles.enrollment.forEach( res => {
          if (control.hasError(res.type)) {
              error = res.message;
            }
          });
        break;
      }
      case 'brand': {
        this.validation_messages_vehicles.brand.forEach( res => {
          if (control.hasError(res.type)) {
              error = res.message;
          }
        });
        break;
      }
      case 'model': {
        this.validation_messages_vehicles.model.forEach( res => {
          if (control.hasError(res.type)) {
              error = res.message;
          }
        });
        break;
      }
      case 'kilometers': {
        this.validation_messages_vehicles.kilometers.forEach( res => {
          if (control.hasError(res.type)) {
              error = res.message;
          }
        });
        break;
      }
      case 'color': {
        this.validation_messages_vehicles.year.forEach( res => {
          if (control.hasError(res.type)) {
              error = res.message;
          }
        });
        break;
      }
      case 'year': {
        this.validation_messages_vehicles.year.forEach( res => {
          if (control.hasError(res.type)) {
              error = res.message;
          }
        });
        break;
      }
    }
    return error;
  }

  async checkUpdate(number: number) {

     const alert = await this.alertController.create({
       header: 'Actualizar Datos',
       message: 'Los datos del usuario o vehiculo han cambiado, si aceptas se actualizaran dichos datos',
       buttons: [
         {
           text: 'Cancelar',
           role: 'cancelar',
           cssClass: 'secondary',
           handler: () => { 
             return;
           }
         }, {
           text: 'Aceptar',
           role: 'aceptar',
           cssClass: 'primary',
           handler: () => {
             switch(number){
               case 1:
                this.customerService.updateCustomer(this.customer);
                break;

              case 2: 
                this.vehicleService.updateVehicle(this.vehicle);
                break;

              case 3:
                this.customerService.updateCustomer(this.customer);
                this.vehicleService.updateVehicle(this.vehicle);
                break;

              default:
                console.log("modificar fallo"); 
                break;
             }
           }
         }
       ]
     });
     await alert.present();
    
  }

 checkEmptyCustomer(): Boolean {
    let diferent: Boolean;
    //Si son diferententes se le asigna un true afirmando que se cambiaron datos
    if (this.customer.phone !== '' ) {
      diferent = true;
    } else if (this. customer.email !== '') {
      diferent = true;
    } else if (this.customer.address !== '') {
      diferent = true;
    } else {
      diferent = false;
    }
    return diferent;
  }

  checkEmptyVehicle(): Boolean {
    let diferent: Boolean;
    if (this.vehicle.enrollment != '') {
      diferent = true;
    } else if (this.vehicle.brand != '') {
      diferent = true;
    } else if (this.vehicle.model != '') {
      diferent = true;
    } else if (this.vehicle.kilometers != '') {
      diferent = true;
    } else if (this.vehicle.color != '') {
      diferent = true;
    } else if (this.vehicle.year != '') {
      diferent = true;
    } else {
      diferent = false;
    }

    return diferent;
  }

  /**
   * Metodo en el cual creo mi FormGroup de clientes
   */
  buildFormGroupCustomers() {
    this.formGroupCustomers =  this.formBuilder.group({
      nif: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$')
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[9|6|7][0-9]{8}$')
      ])),
      address: new FormControl('', Validators.compose([
        Validators.maxLength(30),
        Validators.minLength(0),
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    }, { updateOn: 'blur' });
  }

  /**
   * Metodo en el cual creo mi FormGroup de vehiculos
   */
  buildFormGroupVehicles() {
    this.formGroupVehicles =  this.formBuilder.group({
      enrollment: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^\\d{4}[A-Z]{3}$')
      ])),
      brand: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      model: new FormControl('', Validators.compose([
        Validators.required
      ])),
      kilometers: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('') // falta expresion regular
      ])),
      color: new FormControl('', Validators.compose([
        Validators.required
      ])),
      year: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]{4}$')
      ])),
    }, { updateOn: 'blur' });
  }

  async addIncidence () {
    let date = this.vehicle.enrollment + new  Date().toLocaleDateString();

    while(date.includes('/')){
      date = date.replace('/', '');
    }
    
    this.incidence.idInc = date;
    this.incidence.idCar = this.vehicle.enrollment;
    this.incidence.state = 'drawImage';
    this.incidence.date = new Date().toLocaleDateString();
    this.incidence.imageB64 = '';
    try{
      this.incidenceService.createIncidence(this.incidence);
    }catch(err){
      console.log('aqui');
    }
    
  }

  checkCustomer() : string {
    let resp: string = "crear";
    for(let cus of this.customerArray){
      if(this.customer.nif == cus.data.nif){
        console.log(this.customer, cus);
        if(this.customer.name != cus.data.name ||
            this.customer.phone != cus.data.phone ||
            this.customer.email != cus.data.email ||
            this.customer.address != cus.data.address){
              console.log('enra');
              this.customerDoc = cus.id;
              return resp = "modificar";
        }else{
          resp = "igual";
        }
      }
    }
    console.log(resp);
    return resp;
  }

  checkVehicle() : string {
    let resp: string = "crear";

    for(let veh of this.vehicleArray){
      if(this.vehicle.enrollment == veh.data.enrollment){
        console.log(this.vehicle, veh);
        if(this.vehicle.brand != veh.data.brand ||
            this.vehicle.model != veh.data.model ||
            this.vehicle.kilometers != veh.data.kilometers ||
            this.vehicle.color != veh.data.color ||
            this.vehicle.year.substring(0,4) != veh.data.year){
            this.vehicleDoc = veh.id;
            return "modificar";
        }else{
          console.log("igual");
          resp = "igual";
        }
      }
    }

    return resp;
  }

  continue(){
    //console.log(this.customerArray);
    if(this.checkEmptyCustomer() && this.checkEmptyVehicle()){
      let opcionC: string = this.checkCustomer();
      let numberOp: number = 0;

      switch(opcionC){
        case "crear":
          this.customerService.createCustomer(this.customer);
          break;

        case "modificar":
          numberOp = numberOp + 1;
          break;

        case "igual":
          console.log(opcionC);
          break;
      }
      let opcionV: string = this.checkVehicle();

      switch(opcionV){
        case "crear":
          this.vehicle.owner = this.customer.nif;
          this.vehicleService.createVehicle(this.vehicle);
          break;

        case "modificar":
          this.vehicle.owner = this.customer.nif;
          numberOp = numberOp + 2;
          break;

        case "igual":
          console.log(opcionV);
          break;
      }

      console.log(numberOp);

      if (numberOp != 0) {
        this.checkUpdate(numberOp);

      } 

      this.addIncidence();
      let navigationExtras: NavigationExtras = {
        state: {
          incidence: this.incidence
        }
      };
      this.router.navigate(['/drawimage'], navigationExtras);
         
    }
  }

  checkNifCustomer() {
    this.auxVehicleArray = [];
    for(let cust of this.customerArray){
      if(this.customer.nif == cust.data.nif){
        this.existCustomer = true;
        this.customer.name = cust.data.name;
        this.customer.email = cust.data.email;
        this.customer.phone = cust.data.phone;
        this.customer.address = cust.data.address;
      }
    }
    //Si el usuario existe recorro la lista de vehiculos y guardo en un array Auxiliar los vehiculos que pertenezcan al cliente
    if (this.existCustomer) {
      for (let vech of this.vehicleArray) {
        if (vech.data.owner == this.customer.nif) {          
          this.auxVehicleArray.push(vech);
          console.log(this.auxVehicleArray);
        }
      }
        //this.miSelect.nativeElement.focus();
    }
  }

  getVehicleCustomer(event) {
    
    console.log(event);
     for (let auxV of this.auxVehicleArray) {
       console.log(String(event.detail.value.length), auxV.data.enrollment.length);
      if(event.detail.value == auxV.data.enrollment) {
         this.vehicle = auxV.data;
       }
    }

  }

  async checkEnrVehicle() {
    if (this.customer.nif == '') {

    } else {

      for (let veh of this.vehicleArray) {
        if (this.vehicle.enrollment == veh.data.enrollment) {
          if (veh.data.owner == this.customer.nif) {
            this.vehicle = veh.data;
          } else {
            const alert = await this.alertController.create({
              header: 'Actualizar Datos',
              message: 'La matricula introducida pertenece a otro cliente',
              buttons: [
                {
                  text: 'Aceptar',
                  role: 'aceptar',
                  cssClass: 'primary',
                  handler: () => {
                    this.vehicle.enrollment = '';
                    this.vehicle.color = '';
                    this.vehicle.year = '';
                    this.vehicle.brand = '';
                    this.vehicle.model = '';
                    this.vehicle.kilometers = '';
                    this.vehicle.owner = '';
                  }
                }
              ]
            });
            await alert.present();
           }
          }

        }
    }

  }

  comeBack(){
    this.router.navigate(['/menu']);
  }
}

