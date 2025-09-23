import { Injectable, inject} from '@angular/core';

import { CanActivate, Router, UrlTree } from '@angular/router';

import { Supabase } from '../services/supabase';

import { SweetAlertService } from '../modals/sweet-alert';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  private supabase = inject(Supabase)
  private router = inject(Router)
  private sweetAlert = inject(SweetAlertService) 

  async canActivate(): Promise<boolean | UrlTree> {
    const user = await this.supabase.getUser();

    return user ? true : ( this.sweetAlert.crearMensajeError("No puede ingresar sin iniciar sesión"), this.router.createUrlTree(['/login'])); 
  }

}
