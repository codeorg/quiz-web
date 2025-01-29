import { HttpClient, HttpHeaders } from '@angular/common/http';
import { util } from 'co-utility';
// import * as Fingerprint from '../js/fingerprint';
import { Observable } from 'rxjs';
import { map, mergeMap, retry, catchError } from 'rxjs/operators';
import { environment } from '../environments';
import { Router } from '@angular/router';
import { Token } from '@angular/compiler';

export class HttpProvider {
  public static bid: string;
  lock: boolean = false; //get sess
  captchaAppId: string = '';

  // public static sid: string;
  // public static expire: number;

  constructor(
    private host: string,
    private httpClient: HttpClient,
    private router: Router
  ) {
    if (this.host.endsWith('/')) {
      this.host = this.host.substr(0, this.host.length - 1);
    }
  }

  post(path: string, data?: any): Observable<any> {
    const manager = util.ls.get('manager');
    if (manager && manager.token) {
      const headers = new HttpHeaders().set('authorization', manager.token);
      return this.request(path, data, headers);
    } else {
      return this.request(path, data);
    }
  }

  // api(path: string, data?: any): Observable<any> {
  //     path = '/api' + path;
  //     return this.post(path, data);
  // }

  request(path: string, data: any, headers?: any): Observable<any> {
    let url = '';
    if (/^http[s]*:\/\//gi.test(path)) {
      url = path;
    } else {
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      url = this.host + path;
    }

    // const url: string = this.host + path;
    // console.log('url', url);
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');
    // this.httpClient.request("","",)
    data = data || {};
    return this.httpClient.post(url, data, { headers: headers });
  }

}
