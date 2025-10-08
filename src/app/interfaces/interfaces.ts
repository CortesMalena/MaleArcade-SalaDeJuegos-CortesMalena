
// Quien soy
export interface UsuarioGitHub { 
  login:string;
  avatar_url: string;
  repos_url: string;
  followers:string;
  following:string;
}

// Juego Ahorcado 
export interface Ahorcado {
  id?: number;        
  palabra: string;   
  pista: string;    
}

export interface EstadisticasAhorcado {
  id?: string;
  usuario_id: string;
  nombre_usuario: string; 
  mail_usuario: string;
  palabra_id: number;
  palabra: string;
  letras_seleccionadas: string[];
  tiempo: number; 
  vidas_restantes: number;
  gano: boolean;
  puntos: number;
  created_at?: string;
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
  nombre_usuario: string; 
  mail_usuario: string;   
  puntos: number;
  racha_actual: number;
  racha_maxima: number;
  vidas_restantes: number;
  cartas_acertadas: number;
  cartas_totales: number;
  tiempo: number;   
  created_at?: string;    
}

// Juego Preguntados 
export interface Opcion {
  texto: string;
  correcta: boolean;
}

export interface Pregunta {
  pregunta: string;
  categoria:string,
  opciones: Opcion[];
}

// Interfaz de la estadistica preguntados
export interface EstadisticaPreguntados {
  id?: string;
  usuario_id: string;    
  nombre_usuario: string; 
  mail_usuario: string;   
  puntos: number;
  tiempo_promedio: number;   
  respuestas_correctas: number;
  created_at?: string;    
}

// Interfaz de la estadistica busqueda del tesoro
export interface EstadisticaBusquedaDelTesoro {
  id?: string;
  usuario_id: string;    
  nombre_usuario: string; 
  mail_usuario: string;   
  gano: boolean;
  puntos: number;
  vidas_restantes: number;
  tiempo: number;   
  cantidad_movimientos: number;
  created_at?: string;    
}

