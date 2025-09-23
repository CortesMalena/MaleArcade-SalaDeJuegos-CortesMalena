import { Routes } from '@angular/router';

import { AuthGuard } from './guards/auth-guard';
import { UserResolver } from './guards/user-resolver';
 
export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/bienvenida/bienvenida')
      .then(m => m.Bienvenida), pathMatch: 'full'
    
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login')
      .then(m => m.Login),
    resolve: {
      user: UserResolver
    }
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
    
  },
  { 
    path: 'preguntados', 
    loadComponent: () => import('./components/preguntados/preguntados')
      .then(m => m.Preguntados),
    canActivate: [AuthGuard]
    
  },
  { 
    path: 'ahorcado', 
    loadComponent: () => import('./components/ahorcado/ahorcado')
      .then(m => m.Ahorcado),
    canActivate: [AuthGuard]
  },
  { 
    path: 'mayorOMenor', 
    loadComponent: () => import('./components/mayor-omenor/mayor-omenor')
      .then(m => m.MayorOMenor),
    canActivate: [AuthGuard]
  },
  { 
    path: 'buscarElTesoro', 
    loadComponent: () => import('./components/buscar-el-tesoro/buscar-el-tesoro')
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
