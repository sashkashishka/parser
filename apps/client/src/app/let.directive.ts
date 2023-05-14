import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface LetContext<T> {
  ngLet: T;
}

@Directive({
  selector: '[ngLet]',
})
export class LetDirective<T> {
  // @ts-ignore
  private _context: LetContext<T> = { ngLet: undefined };

  constructor(
    _viewContainer: ViewContainerRef,
    _templateRef: TemplateRef<LetContext<T>>,
  ) {
    _viewContainer.createEmbeddedView(_templateRef, this._context);
  }

  @Input()
  set ngLet(value: T) {
    this._context.ngLet = value;
  }
}
