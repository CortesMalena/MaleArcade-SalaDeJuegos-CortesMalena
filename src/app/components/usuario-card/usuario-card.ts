import { Component, input } from '@angular/core';
import { UsuarioGitHub } from '../../interfaces/interfaces';

import { HoverScale } from '../../directives/hover-scale';
@Component({
  selector: 'app-usuario-card',
  imports: [HoverScale],
  templateUrl: './usuario-card.html',
  styleUrl: './usuario-card.css'
})
export class UsuarioCard {
  // renderizo de forma reactiva mi usuario y mis repositorios
  usuario = input.required<UsuarioGitHub>();
  repositorios = input.required<number>();

}

