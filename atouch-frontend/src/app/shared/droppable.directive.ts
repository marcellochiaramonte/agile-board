import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import interact from 'interactjs';

@Directive({
  selector: '[appDroppable]',
})
export class DroppableDirective implements OnInit {
  @Input()
  options: any;

  @Output()
  dropping: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    interact(this.elementRef.nativeElement)
      .dropzone(Object.assign({}, this.options || {}))
      .on('dropactivate', (event) => event.target.classList.add('can-drop'))
      .on('dragenter', (event) => {
        console.log('drag enter');

        const draggableElement = event.relatedTarget;
        const dropzoneElement = event.target;

        dropzoneElement.classList.add('can-catch');
        draggableElement.classList.add('drop-me');
      })
      .on('dragleave', (event) => {
        console.log('drag leave');
        event.target.classList.remove('can-catch', 'caught-it');
        event.relatedTarget.classList.remove('drop-me');
      })
      .on('drop', (event) => {
        const model = (window as any).dragData;

        console.log('drag drop');

        if (typeof model === 'object') {
          this.dropping.emit(model);
        }
        event.target.classList.add('caught-it');

        if ((window as any).document.selection) {
          (window as any).document.selection.empty();
        } else {
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
          }
        }
      })
      .on('dropdeactivate', (event) => {
        event.target.classList.remove('can-drop');
        event.target.classList.remove('can-catch');
      });
  }
}
