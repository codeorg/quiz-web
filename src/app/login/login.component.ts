import { ViewChild, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { event, EventType, Http } from '../../service';
import { util } from 'co-utility';
import { environment } from '../../environments';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgZorroAntdModule } from '../ng-zorro-antd.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [NgZorroAntdModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  showQrcode: boolean = false;
  passwordVisible: boolean = false;
  validateForm!: FormGroup;
  qrcodeUrl: any;
  msg: string = '打开微信客户端扫码登录';
  msgClassEnum: any = {
    normal: '#999',
    error: 'red',
    success: 'green',
  };
  socketType: 'normal' | 'error' | 'success' = 'normal';
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




  login() {
    let form = {
      username: this.validateForm.controls['username'].value,
      password: this.validateForm.controls['password'].value,
    }
    let data = {
      "query": `query Query($password: String!, $username: String!) {
        login(password: $password, username: $username)
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
        } else {

          let user = JSON.parse(res.data.login);
          console.log('user', user)
          util.ls.set('manager', user)
          // this.notification.create('success', '登录成功', '', {
          //   nzClass: 'notification-gray',
          // });
          console.log('user.menu[0].link',user.menu[0].link)
          return this.route.navigateByUrl(user.menu[0].link);
        }

      });
  }



  ngOnInit(): void {

    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

  }

  ngOnDestroy(): void {
  }
}
