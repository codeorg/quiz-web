import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { OrderListComponent } from './order-list/order-list.component';
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [{
      path: 'orderlist',
      component: OrderListComponent,
    },
    {
      path: 'myorder',
      component: MyOrderComponent,
    }
    ]

  },
];
