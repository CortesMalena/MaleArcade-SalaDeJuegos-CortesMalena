import { Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { Ahorcado, EstadisticasAhorcado, EstadisticaMayorOMenor } from '../interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class JuegosService {
  
  private supabase: SupabaseClient;

  // Inyecto el servicio Supabase
  constructor(private supabaseService: Supabase) {

    // Obtengo la instancia del cliente de Supabase
    this.supabase = this.supabaseService.getClient();
  }

  ///////////////
  // AHORCADO //
  //////////////

  // Obtener TODOS los datos del ahorcado -> en caso de ser necesario
  async obtenerDatosAhorcado(): Promise<{ data: Ahorcado[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from('ahorcado')
      .select('*');

    if (error) throw new Error(`Ocurrió un error al obtener los datos del ahorcado: ${error.message}`);
    
    return { data, error };
  }

  // Obtengo la cantidad de palabras
  async obtenerCantidadTotalPalabrasAhorcado(): Promise <number> {
    const { count, error } = await this.supabase
    .from('ahorcado')
    .select('id', { count: 'exact', head: true });

    if (error) throw error;
    // pasa el error y no trae datos
    if (!count) throw new Error('No hay palabras disponibles'); 

    return count;
  }

  // Obtengo una palabra random directamente desde la base de datos
  async obtenerAhorcadoRandom(): Promise<Ahorcado | null>  {

    const total = await this.obtenerCantidadTotalPalabrasAhorcado();
    
    const indiceRandom = Math.floor(Math.random() * total);

    const { data, error } = await this.supabase
    .from('ahorcado')
    .select('*')
    .range(indiceRandom, indiceRandom) // range para no tener problema con posibles registros borrados
    .single();

    if (error) throw error;

    return data;
  }

  // Guardo los datos del ahorcado 
  async guardarDatosAhorcado (estadistica: EstadisticasAhorcado): Promise<boolean> {
    const { error } = await this.supabase
    .from('estadisticas_ahorcado')
    .insert([
      {
        usuario_id: estadistica.usuarioId,
        palabra_id: estadistica.palabraId,
        letras_seleccionadas: estadistica.letrasSeleccionadas,
        tiempo: estadistica.tiempo,
        vidas_restantes: estadistica.vidasRestantes,
        gano: estadistica.gano,
        puntos: estadistica.puntos
      }
    ]);

    if (error) throw error;
    
    return true;
  }
  
  // Obtengo las estadisticas del ahorcado
  async obtenerEstadisticasAhorcado (usuarioId: string): Promise<any>{
    const { data, error } = await this.supabase
      .from('estadisticas_ahorcado')
      .select('*')
      .eq('usuario_id', usuarioId) 

    if (error) throw error;

    return data;
  }

  ///////////////////
  // MAYOR O MENOR // 
  /////////////////// 

  // Guardo los datos del MAYOR O MENOR 
  async guardarDatosMayorOMenor (estadistica: EstadisticaMayorOMenor): Promise<boolean> {
    const { error } = await this.supabase
    .from('estadisticas_mayor_o_menor')
    .insert([
      {
        usuario_id: estadistica.usuario_id,      
        puntos: estadistica.puntos,
        racha_actual: estadistica.racha_actual,
        racha_maxima: estadistica.racha_maxima,
        vidas_restantes: estadistica.vidas_restantes,
        cartas_acertadas: estadistica.cartas_acertadas,
        cartas_totales: estadistica.cartas_totales,
        tiempo: estadistica.tiempo,     

      }
    ]);

    if (error) throw error;
    
    return true;
  }
  
  // Obtengo las estadisticas del juego Mayor o menor
  async obtenerEstadisticasMayorOMenor (usuarioId: string) : Promise<any>{
    const { data, error } = await this.supabase
      .from('estadisticas_mayor_o_menor')
      .select('*')
      .eq('usuario_id', usuarioId) 

    if (error) throw error;

    return data;
  }


}
