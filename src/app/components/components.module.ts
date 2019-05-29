import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { DrawingBoardComponent } from './drawing-board/drawing-board.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HeaderComponent, DrawingBoardComponent],
  exports: [
    HeaderComponent, 
    DrawingBoardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class ComponentsModule { }
