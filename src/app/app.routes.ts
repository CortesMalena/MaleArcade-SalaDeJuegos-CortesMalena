import { Routes } from '@angular/router';
import { Bienvenida } from './pages/bienvenida/bienvenida';
import { Login } from './pages/login/login';
import { QuienSoy } from './pages/quien-soy/quien-soy';
import { Registro } from './pages/registro/registro';
import { Preguntados } from './components/preguntados/preguntados';
import { Ahorcado } from './components/ahorcado/ahorcado';
import { BuscarElTesoro } from './components/buscar-el-tesoro/buscar-el-tesoro';
import { MayorOMenor } from './components/mayor-omenor/mayor-omenor';

export const routes: Routes = [
    { path: '', component: Login}, //Redirección inicial por ahora
    { path: 'quienSoy', component:QuienSoy},
    { path: 'bienvenida', component:Bienvenida},
    { path: 'registro', component:Registro},
    { path: 'preguntados', component:Preguntados},
    { path: 'ahorcado', component:Ahorcado},
    { path: 'mayorOMenor', component:MayorOMenor},
    { path: 'buscarElTesoro', component:BuscarElTesoro},
    { path: '**', redirectTo: '' }, 
];
