import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import {
  tap,
  map,
  mergeMap,
  filter,
  debounceTime,
  distinctUntilChanged,

  catchError,
  first
} from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { Router } from '@angular/router';
import { util } from 'co-utility';
import { Http } from './http';
import { event, Alert } from './index';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private router: Router,
    private http: Http,
    private notification: NzNotificationService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        // 'APIKEY': '33726880C9CE84E67A5C27BD4A2CE91AD2',
        // 'token': token ? token : token_snap || 'mano'
      }
    });
    // return next.handle(req);
    return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
      console.error('sssss',error)
      console.error('error.error.errors',error.error.errors)
      if (error.error.errors) {
        let code = error.error.errors[0].extensions.code;
        switch (code) {
          case 4004:+
            util.ls.remove('manager');
            return this.http.post(req.url, req.body);
            break;
        }
      } 

      return throwError(() => new Error(error.message));
    })).pipe(
      mergeMap((res: HttpEvent<any>) => {
        if (res instanceof HttpResponse && res.body.errors) {
          console.log('res.body->', res.body);
          let code = res.body.errors[0].extensions.code;

          switch (code) {
            case 'UNAUTHORIZED':
              this.router.navigate(['/login']);
              return of(res);
          }
        } else if (res instanceof HttpResponse && res.status !== 200) {
          return throwError(() => { res });
        }
        return of(res);

        // return Observable.create(observer => observer.next(res));
      })
      // ,
      // catchError((error: any) => {
      //   // console.log(error);
      //   return of(error);
      // })
    )
  }

  // handleError(error: HttpErrorResponse) {
  //   console.log('erro---', error);
  //   // return this.router.navigate(['/error']);
  //   // const err = {url: error['url'], status: error['status'], msg: error['error'].msg};
  //   // return throwError(err);
  // }


}
