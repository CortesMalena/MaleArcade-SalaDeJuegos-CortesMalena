import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverScale]',
  standalone: true
})
export class HoverScale {

  // escala y duración
  @Input('appHoverScale') escala: number = 1; 
  @Input() duracion: number = 300; 
  @Input() zIndex: number = 10; // valor de z-index al hover
  @Input() colorDesignado: boolean = true;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // inicializamos la transición
    this.renderer.setStyle(this.el.nativeElement, 'transition', `transform ${this.duracion}ms ease`);
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative'); // necesario para que z-index funcione
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 10px 20px rgba(0, 0, 0, 0.5)');

    if (!this.colorDesignado) {
      this.renderer.setStyle(this.el.nativeElement, 'color', 'black')
    }

  }

  @HostListener('mouseenter') onMouseEnter() {
    // Escala y  que se encuentre por arriba
    this.renderer.setStyle(this.el.nativeElement, 'transform', `scale(${this.escala})`);
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 10px 20px rgba(255, 0, 0, 0.4)');

    if (!this.colorDesignado) {
      this.renderer.setStyle(this.el.nativeElement, 'color', '#d34a24');
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    // Vuelvo a la posicion original
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
    this.renderer.setStyle(this.el.nativeElement, 'z-index', '1'); // volvemos al valor base
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 10px 20px rgba(0, 0, 0, 0.5)');
    
    if (!this.colorDesignado) {
      this.renderer.setStyle(this.el.nativeElement, 'color', 'black')
    }

  }

}
