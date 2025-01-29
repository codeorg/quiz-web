import { Component, OnDestroy, OnInit, Injectable } from '@angular/core';

import { event, adminRouterEvent, EventType, HttpProvider, Alert, Message } from '../../service';
// import {Modal} from './modal';
// import {AlertComponent} from './alert.component';
// import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  Router,
  ActivatedRoute,
  NavigationStart,
  NavigationEnd,
} from '@angular/router';
import { util } from 'co-utility';
import {
  Observable,
} from 'rxjs';
import {
  map,
  mergeMap,
  debounceTime,
  distinctUntilChanged,
  catchError,
  first,
} from 'rxjs/operators';
import { environment } from '../../environments';

@Injectable()
export abstract class AdminBase implements OnDestroy, OnInit {
  public subscription: any[] = [];
  // public Action: ActionType = ActionType.Add;
  routerChangeFn: any = {};
  Action: typeof Action = Action;
  util = util;
  config = environment;
  manager: any = null;
  alert: Alert = new Alert();
  message: Message = new Message();

  constructor(public router: Router, public http: HttpProvider) {
    this.manager = util.ls.get('manager');
  }

  ngOnInit() {
  }

  setTitle(title: string, backUrl?: string, buttonProps?: any): void {
    event.emit(EventType.Title, {
      title: title,
      backUrl: backUrl,
      buttonProps: buttonProps,
    });
  }

  setPrevAndNext(buttonProps: any): void {
    event.emit(EventType.PrevAndNext, buttonProps);
  }


  // checkManager(): Observable<string> {
  //   let manager = util.ls.get('manager');
    

  // }

  // setBackButton(backUrl: string): void {
  //   event.emit(EventType.Back, {backUrl: backUrl});
  // }
  routerChange(cb: any): void {
    if (!this.routerChangeFn[this.getPathname(this.router.url)]) {
      // console.log('执行cb');
      cb();
    }
    this.routerChangeFn[this.getPathname(this.router.url)] = cb;
    const sub = this.router.events.pipe(debounceTime(100)).subscribe((e) => {
      if (e instanceof NavigationEnd) {
        let url = this.getPathname(e.url);
        // console.log('NavigationEnd路由切换', url);
        let fn = this.routerChangeFn[url];
        if (fn) fn();
        console.log('执行fn');
        // cb();
      }
    });


    this.subscription.push(sub);
  }

  getPathname(url: string): string {
    // return url;
    let m = /^(\/admin\/[^\?]+)/gi.exec(url);
    if (!m || m.length < 2) return '';
    return m[1];
  }

  go(url: string): void {
    this.router.navigateByUrl(url);
  }


  ngOnDestroy(): void {

  }
}

export enum Action {
  Add = 'add',
  Update = 'update',
}
