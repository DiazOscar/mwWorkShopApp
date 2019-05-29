import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DrawimagePage } from './drawimage.page';
import { ComponentsModule } from 'src/app/components/components.module';

import { AngularFireStorageModule} from '@angular/fire/storage';

const routes: Routes = [
  {
    path: '',
    component: DrawimagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    AngularFireStorageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DrawimagePage]
})
export class DrawimagePageModule {}
