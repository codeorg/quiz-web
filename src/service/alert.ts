import {Injectable, EventEmitter, OnInit} from '@angular/core';
import {event, EventType} from './event';

class Alert {
  constructor() {
  }

  info(content:any): void {
    event.emit(EventType.Alert, {level: 'info', content});
  }

  success(content:any): void {
    event.emit(EventType.Alert, {level: 'success', content});
  }

  error(content:any): void {
    event.emit(EventType.Alert, {level: 'error', content});
  }
}

export {Alert};
