import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { NgZorroAntdModule } from '../ng-zorro-antd.module';


@NgModule({
  declarations: [],
  imports: [ ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgZorroAntdModule,
    RouterModule,
  ],
  providers: [],
})
export class AdminModules {}
