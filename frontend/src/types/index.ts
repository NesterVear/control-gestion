

export interface Usuario {
  id: number;
  usuario: string;
  contrasena?: string;
  rol: 'Lector' | 'Capturista' | 'Administrador' | 'SuperRoot';
  es_super_usuario?: boolean;
}

export interface Captura {
  folio_acaac: number;
  usuario_id: number;
  fecha_elaboracion: string;
  fecha_recepcion: string;
  numero_oficio: string;
  asunto?: string;
  remitente?: string;
  destinatario?: string;
  prioridad: Prioridad;
  observacion?: string;
  atendio?: Atendio;
  pdf_url?: string;
  eliminado: boolean;
  eliminado_por?: number;
  tipo: 'Entrada' | 'Salida';
  status?: 'Conocimiento' | 'Respuesta';
  respuesta_pdf_url?: string;
  completado: boolean;
}

export interface DirectorioExterno {
  id: number;
  nombre: string;
  cargo?: string;
  institucion?: string;
}

export interface DirectorioInterno {
  id: number;
  nombre: string;
  cargo?: string;
}

export interface LoginResponse {
  mensaje: string;
  id: number;
  rol: 'Lector' | 'Capturista' | 'Administrador' | 'SuperRoot';
}

export interface ApiError {
  error: string;
}

export interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (usuario: string, contrasena: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  setUser?: React.Dispatch<React.SetStateAction<Usuario | null>>;
}

export type Prioridad = 'Urgente'| 'ExtraUrgente' | 'Ordinario';
export type Atendio = 'Mitzi' | 'Edgar' | 'Rosy' | 'Chiqui';