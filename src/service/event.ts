import { Injectable, EventEmitter, OnInit } from '@angular/core';
import {
  flatMap,
  map,
  mergeMap,
  debounceTime,
  distinctUntilChanged,
  catchError,
  first,
} from 'rxjs/operators';

export enum EventType {
  Close = 0,
  Lodding = 1,
  Stat = 2,
  Alert = 3,
  Title = 4,
  Message = 5,
  PrevAndNext = 6,
  AdminRouter = 7,
  // Back = 6,
}

class Event {
  private emitter: EventEmitter<any>;

  constructor() {
    // 定义发射事件
    this.emitter = new EventEmitter();
  }

  emit(type: EventType, data?: any) {
    const msg: any = {
      type: type,
      body: data,
    };
    this.emitter.emit(msg);
  }

  subscribe(generatorOrNext?: any, error?: any, complete?: any): any {
    return this.emitter
      .pipe(debounceTime(10))
      .subscribe({ next: generatorOrNext, error, complete })
    //.subscribe(generatorOrNext, error, complete);
  }
}

let event = new Event();
let adminRouterEvent = new Event();
export { event, adminRouterEvent };
