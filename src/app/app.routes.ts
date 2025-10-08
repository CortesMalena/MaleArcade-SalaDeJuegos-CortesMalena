import { Routes } from '@angular/router';

import { AuthGuard } from './guards/auth-guard';
import { UserResolver } from './guards/user-resolver';
import { GuestGuard } from './guards/guest-guard';
import { AgeGuard } from './guards/age-guard';


export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/bienvenida/bienvenida')
      .then(m => m.Bienvenida), pathMatch: 'full',resolve:{
      user: UserResolver
    }, canActivate: []
    
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login')
      .then(m => m.Login),
    canActivate: [GuestGuard]

  },
  { 
    path: 'quienSoy', 
    loadComponent: () => import('./pages/quien-soy/quien-soy')
      .then(m => m.QuienSoy) 
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./pages/registro/registro')
      .then(m => m.Registro),
    canActivate: [GuestGuard]
    
  },
  { 
    path: 'resultados', 
    loadComponent: () => import('./pages/resultados/resultados')
      .then(m => m.Resultados),
    
  },
  { 
    path: 'preguntados', 
    loadComponent: () => import('./components/juegos/preguntados/preguntados')
      .then(m => m.Preguntados),
    canActivate: [AuthGuard]
    
  },
  { 
    path: 'ahorcado', 
    loadComponent: () => import('./components/juegos/ahorcado/ahorcado')
      .then(m => m.Ahorcado),
    canActivate: [AgeGuard, AuthGuard]
  },
  { 
    path: 'mayorOMenor', 
    loadComponent: () => import('./components/juegos/mayor-omenor/mayor-omenor')
      .then(m => m.MayorOMenor),
    canActivate: [AuthGuard]
  },
  { 
    path: 'buscarElTesoro', 
    loadComponent: () => import('./components/juegos/buscar-el-tesoro/buscar-el-tesoro')
      .then(m => m.BuscarElTesoro),
    canActivate: [AuthGuard]
  },
  { 
    path: 'chat', 
    loadComponent: () => import('./components/chat/chat')
      .then(m => m.Chat),
    canActivate: [AuthGuard]

  },
  { 
    path: '**', 
    redirectTo: '' 
  }, 
];
