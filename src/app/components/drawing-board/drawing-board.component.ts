import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-drawing-board',
  templateUrl: './drawing-board.component.html',
  styleUrls: ['./drawing-board.component.scss'],
})
export class DrawingBoardComponent {

  @ViewChild('myCanvas') canvas: any;
  canvasElement: any;
  startX: any;
  startY: any;
  isDown = false;
  ctx: any;
  public myForm: FormGroup;
  @Output() public averiasEmmit = new EventEmitter();
  public averias = [];
  public touches = []; 

  

  constructor( private formBuilder: FormBuilder){

    console.log(this.canvas);

    this.myForm = formBuilder.group({

    });
  }

  ngAfterViewInit(){

    console.log(this.canvas);
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.style.background = "url(../../assets/img/coche.png)";
    this.canvasElement.style.backgroundRepeat = "no-repeat";
    this.canvasElement.style.backgroundSize = "100% 100%";
    this.canvasElement.width = document.body.clientWidth - 6;
    this.canvasElement.height = (document.body.clientHeight*3)/7;

    this.ctx = this.canvasElement.getContext('2d');
  }

  handleStart( ev ){

    ev.preventDefault();
    ev.stopPropagation();

    this.startX = ev.touches[0].clientX - this.canvasElement.offsetLeft;
    this.startY = ev.touches[0].clientY - this.canvasElement.offsetTop;

    this.drawCircle(this.startX, this.startY);
    this.addControl();
    
  }

  // handleMove( ev ){

  //   if (!this.isDown) {
  //     return;
  //   }

  //   ev.preventDefault();
  //   ev.stopPropagation();
  //   let mouseX = ev.touches[0].clientX - this.offsetX;
  //   this.endX = mouseX;    
  //   let mouseY = ev.touches[0].clientY - this.offsetY;
  //   this.endY = mouseY;
  //   this.drawCircle(mouseX, mouseY);
    
  // }


  // function to draw the oval and put center text

  // handleEnd( ev ){
  //   if (!this.isDown) {
  //     return;
  //   }

  //   ev.preventDefault();
  //   ev.stopPropagation();
  //   this.isDown = false;  
    
  //   this.ctx.stroke(); 
  //   this.ctx.font = "30px sans-serif";
  //   this.ctx.fillStyle = "#FF0000";
  //   this.ctx.fillText(this.count +1, this.startX, this.startY);
  //   // center of oval
    
  //   //create a text in the middle of the circle
  //   //this.ctx.fillText(this.count+1, (this.startX + (this.endX - this.startX) / 2)-4, (this.startY + (this.endY - this.startY) / 2)+4);
  //   this.addControl();
    
  // }

  drawCircle(x, y) {
    
    //this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    //this.ctx.clearRect(x, y, this.startX, y, this.startX, this.startY + (y - this.startY) / 2);
    
    // to create an oval 
    // this.ctx.beginPath();
    // this.ctx.strokeStyle = '#000';
    // this.ctx.lineWidth = 8;
    // this.ctx.moveTo(this.startX, this.startY + (y - this.startY) / 2);
    // this.ctx.bezierCurveTo(this.startX, this.startY, x, this.startY, x, this.startY + (y - this.startY) / 2);
    // this.ctx.bezierCurveTo(x, y, this.startX, y, this.startX, this.startY + (y - this.startY) / 2);
    // this.ctx.closePath(); 

    this.ctx.beginPath();
    this.ctx.arc(x, y, 40, 0, 2 * Math.PI);
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    this.ctx.font = "30px sans-serif";
    this.ctx.fillStyle = "#FF0000";
    if(this.touches.length < 9){
      this.ctx.fillText(this.touches.length + 1, this.startX-6, this.startY+6);
    }else{
      this.ctx.fillText(this.touches.length + 1, this.startX-15, this.startY+6);
    }
    
    this.ctx.closePath();
    
  }

  clearAll(){
    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.myForm = this.formBuilder.group({ });
    this.averias = [];
    this.touches = [];
    this.averiasEmmit.emit(this.averias);
  }

  addControl(){
    if(this.touches.length < 10){
      this.myForm.addControl('0'+(this.touches.length), new FormControl('', Validators.required));
    }else{
      this.myForm.addControl(String(this.touches.length), new FormControl('', Validators.required));
    }    

    this.touches.push({ "id": this.touches.length,
                        "x": this.startX,
                        "y": this.startY
                        });
    
    this.averiasEmmit.emit(this.averias);
  }

  removeControl(control){
    
    console.log(control);
    this.ctx.clearRect(this.touches[parseInt(control.key)].x - 40 -3, this.touches[parseInt(control.key)].y - 40 -3, 40 * 2 + 6, 40 * 2 + 6);
    this.averias.splice(parseInt(control.key), 1);    
    this.myForm.removeControl(control.key);
    this.touches.splice(this.touches[parseInt(control.key)].id, 1);
    this.averiasEmmit.emit(this.averias);
    console.log( this.myForm.controls);
    console.log( this.touches[control.key]);
    console.log( this.touches)
  }

  checkValue(control: string): boolean{
    let number:number = parseInt(control);
    if(number >= (this.touches.length-1)){
      return true;
    }else{
      return false;
    }
  }
}
