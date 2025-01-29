import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpProvider } from './http-provider';
import { environment } from '../environments';
import { Router } from '@angular/router';

@Injectable()
export class Http extends HttpProvider {
    constructor(http: HttpClient, router: Router) {
        super(environment.api, http, router);
    }
}

// @Injectable()
// export class HttpAlipay extends HttpProvider {
//     constructor(http: HttpClient, router: Router) {
//         super(environment.alipay, http, router);
//     }
// }

// @Injectable()
// export class HttpTencent extends HttpProvider {
//     constructor(http: HttpClient, router: Router) {
//         super(environment.tencent, http, router);
//     }
// }




