import { Routes } from '@angular/router';
import { AuthService } from '../service';
import { LoginComponent } from './login/login.component';
import { RegComponent } from './reg/reg.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { path: 'reg', component: RegComponent },
  //{ path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }

  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES), canActivate: [AuthService] }
];
