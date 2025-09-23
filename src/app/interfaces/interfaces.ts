
// Juego Ahorcado 
export interface Ahorcado {
  id?: number;        
  palabra: string;   
  pista: string;    
}

export interface EstadisticasAhorcado {
  id?: string;
  usuarioId: string;
  palabraId: number;
  letrasSeleccionadas: string[];
  tiempo: number; 
  vidasRestantes: number;
  gano: boolean;
  puntos: number;
  createdAt?: Date;
}

// Chat en tiempo real 
export interface chat {
  id?: string;
  user_id: string;
  mensaje: string;
  created_at?: string;
  nombre:string;
}

// Juego de mayor o Menor
export interface Carta {
  valor: number; 
  nombre: string; 
  palo: string; 
  imagen: string 
}

// Interfaz de la estadistica de mayor o menor
export interface EstadisticaMayorOMenor {
  id?: string;
  usuario_id: string;       
  puntos: number;
  racha_actual: number;
  racha_maxima: number;
  vidas_restantes: number;
  cartas_acertadas: number;
  cartas_totales: number;
  tiempo: number;   
  created_at?: string;     
}
