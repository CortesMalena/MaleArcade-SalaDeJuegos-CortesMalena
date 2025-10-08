import { Injectable, inject} from '@angular/core';

import { CanActivate, Router, UrlTree } from '@angular/router';

import { Supabase } from '../services/supabase';

import { SweetAlertService } from '../modals/sweet-alert';

@Injectable({
  providedIn: 'root'
})

export class AgeGuard implements CanActivate {
  private supabase = inject(Supabase)
  private router = inject(Router)
  private sweetAlert = inject(SweetAlertService) 

  async canActivate(): Promise<boolean | UrlTree> {
    const user = await this.supabase.getUser();

    if (user?.user_metadata['edad'] >= 18) {
        return true;
    } else {
        return ( this.sweetAlert.crearMensajeError(`No puede ingresar a menos que sea +18 años, usted tiene ${user?.user_metadata['edad']} años`), this.router.createUrlTree(['/']))
    }
  }

}
