import { Directive, ElementRef, OnInit, NgZone } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true
})
export class Autofocus implements OnInit {

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnInit() {

    // no actualizar la vista 
    this.ngZone.runOutsideAngular(() => {
      // Busca el collapse padre más cercano
      const collapseParent = this.el.nativeElement.closest('.collapse');

      const focusInput = () => {
        this.el.nativeElement.focus();
      };

      if (collapseParent) {
        // Si hay collapse, espera a que se abra
        collapseParent.addEventListener('shown.bs.collapse', focusInput);
      } else {
        // Si no hay collapse, enfoca inmediatamente
        // Usar setTimeout para asegurar que el DOM esté completamente cargado
        setTimeout(() => {
          this.el.nativeElement.focus();
        }, 0);

      }
    });
  }
}
