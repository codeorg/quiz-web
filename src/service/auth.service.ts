import {Injectable} from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
// import { TranslateService } from '@ngx-translate/core';
// import { ToastService } from 'ng-devui';
import {Observable} from 'rxjs';
// import { AuthService } from './auth.service';
import {util} from 'co-utility';

@Injectable()
export class AuthService implements CanActivate {
    constructor(
        private router: Router,
        // private authService: AuthService,
        // private toastService: ToastService,
        // private translate: TranslateService
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const manager = util.ls.get('manager');
        //本地可以检验权限
        if (!manager || !manager._id) {
            this.router.navigate(['login']);
            return false;
        } else {
            return true;
        }
    }
}
