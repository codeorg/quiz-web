import { ViewChild, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { event, EventType, Http } from '../../service';
import { util } from 'co-utility';
import { environment } from '../../environments';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgZorroAntdModule } from '../ng-zorro-antd.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reg',
  imports: [NgZorroAntdModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.scss'],
})
export class RegComponent implements OnInit, OnDestroy {
  showQrcode: boolean = false;
  passwordVisible: boolean = false;
  validateForm!: FormGroup;
  msgClassEnum: any = {
    normal: '#999',
    error: 'red',
    success: 'green',
  };
  selectedIndex: number = 0;
  err: any = {
    sign: '签名失败，请重新登录',
    permission: '没有权限，请重新登录',
  };
  constructor(
    private fb: FormBuilder,
    private http: Http,
    private route: Router,
    private ar: ActivatedRoute,
    private notification: NzNotificationService
  ) {
    // this.socket = new Socket();
  }


  submitForm(): void {
    console.log(this.validateForm.controls);
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }




  reg() {
    let form = {
      username: this.validateForm.controls['username'].value,
      password: this.validateForm.controls['password'].value,
      mobile: this.validateForm.controls['mobile'].value,
      role: this.validateForm.controls['role'].value,
    }
    let data = {
      "query": `mutation Reg($role: String!, $password: String!, $mobile: String!, $username: String!) {
        reg(role: $role, password: $password, mobile: $mobile, username: $username)
      }`,
      "variables": form
    }

    console.log('data', data)

    this.http
      .post('/', data)
      .subscribe((res: any) => {
        // console.log('res---', res);

        if (res.errors) {
          return this.notification.create('error', res.errors[0].message, '', {
            nzClass: 'notification-gray',
          });
        }else{
          this.notification.create('success', '注册成功', '', {
            nzClass: 'notification-gray',
          });
          return this.route.navigateByUrl('/login');
        }
        
      });
  }


  ngOnInit(): void {
    if (this.ar.snapshot.queryParams['type'] == 'scan') {
      this.selectedIndex = 1;
    } else {
      this.selectedIndex = 0;
    }
    if (this.ar.snapshot.queryParams['err']) {
      this.notification.create(
        'error',
        this.err[this.ar.snapshot.queryParams['err']],
        ''
      );
    }
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      mobile: [null, [Validators.required]],
      role: ['user', [Validators.required]],
      remember: [true],
    });

  }

  ngOnDestroy(): void {
  }
}
