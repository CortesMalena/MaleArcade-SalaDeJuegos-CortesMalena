import { Component, input } from '@angular/core';
import { Usuario } from '../../services/api';

@Component({
  selector: 'app-usuario-card',
  imports: [],
  templateUrl: './usuario-card.html',
  styleUrl: './usuario-card.css'
})
export class UsuarioCard {
  // renderizo de forma reactiva mi usuario y mis repositorios
  usuario = input.required<Usuario>();
  repositorios = input.required<number>();

}

