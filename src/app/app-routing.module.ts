import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NologinGuard } from './guards/nologin.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule', canActivate : [NologinGuard]  },
  { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule', canActivate : [AuthGuard] },
  { path: 'formulario', loadChildren: './pages/formulario/formulario.module#FormularioPageModule' },
  { path: 'drawimage', loadChildren: './pages/drawimage/drawimage.module#DrawimagePageModule' },
  { path: 'damagelist', loadChildren: './pages/damagelist/damagelist.module#DamagelistPageModule' },
  { path: 'summary', loadChildren: './pages/summary/summary.module#SummaryPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
