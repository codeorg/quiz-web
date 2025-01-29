import {Injectable, EventEmitter, OnInit} from '@angular/core';
import {event, EventType} from './event';

class Message {
  constructor() {
  }

  info(content:any): void {
    event.emit(EventType.Message, {level: 'info', content});
  }

  success(content:any): void {
    event.emit(EventType.Message, {level: 'success', content});
  }

  error(content:any): void {
    event.emit(EventType.Message, {level: 'error', content});
  }

  warning(content:any): void {
    event.emit(EventType.Message, {level: 'warning', content});
  }
}

export {Message};
