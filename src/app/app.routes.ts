import { Routes } from '@angular/router';
import { Bienvenida } from './pages/bienvenida/bienvenida';
import { Login } from './pages/login/login';
import { QuienSoy } from './pages/quien-soy/quien-soy';
import { Registro } from './pages/registro/registro';

export const routes: Routes = [
    { path: '', component: Bienvenida}, //Redirección inicial por ahora
    { path: 'quienSoy', component:QuienSoy},
    { path: 'login', component:Login},
    { path: 'registro', component:Registro},
    { path: '**', redirectTo: '' }, 
];
