import { inject, Injectable } from '@angular/core';
import { Supabase } from '../services/supabase';


@Injectable({
  providedIn: 'root'
})
export class UserResolver {
  private supabaseService = inject(Supabase);

  resolve() {
    return this.supabaseService.getUser();
  }

}
