import { inject, Injectable } from '@angular/core';
import { Supabase } from '../services/supabase';


@Injectable({
  providedIn: 'root'
})
export class UserResolver {
  private supabaseService = inject(Supabase);

  async resolve() {
    return await this.supabaseService.getUser();
  }

}
