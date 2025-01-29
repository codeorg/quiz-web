


import { Component, OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef, Injector } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AdminBase } from './admin.base';
import { adminRouterEvent, event, EventType, Http } from '../../service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { util } from 'co-utility';

import { catchError, debounceTime, distinctUntilChanged, first, map, mergeMap } from 'rxjs/operators';
import { AdminModules } from './admin.modules'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  //imports: [ RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule,NzButtonModule],
  imports: [RouterOutlet, AdminModules],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent extends AdminBase implements AfterViewInit, OnInit, OnDestroy {
  isCollapsed = true;
  visible: boolean = false;
  pageHeader: any = {
    title: '',
    requireBack: false,
    backUrl: '',
    prevAndNext: {
      before: '',
      after: '',
    },
  };
  // adminManager: any = {};
  isDashboard: Boolean = false;
  stat: any = {
    inform: 0,
    message: 0
  };

  constructor(
    router: Router,
    http: Http,
    private nzMessage: NzMessageService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    // private compiler: Compiler,
    // private injector: Injector,
    private changeRef: ChangeDetectorRef
  ) {
    super(router, http);
    // 全局事件
    const sub = event.subscribe((value: any) => {
      // console.log(value,"event监听器");
      switch (value.type) {
        case EventType.Title:
          // console.log("进来了?")
          // console.log('EventType.Title', value);
          this.pageHeader.title = value.body.title;
          if (!value.body.backUrl) {
            this.pageHeader.requireBack = false;
          } else {
            this.pageHeader.requireBack = true;
            this.pageHeader.backUrl = value.body.backUrl;
          }
          this.pageHeader.prevAndNext = {
            ...value.body.buttonProps,
          };

          break;
        // case EventType.Back:
        //   console.log('EventType.Back', value);
        //   if (!value.body.backUrl) {
        //     this.pageHeader.requireBack = false;
        //   } else {
        //     this.pageHeader.requireBack = true;
        //   }
        //   this.pageHeader.backUrl = value.body.backUrl;
        //   break;
        case EventType.PrevAndNext:
          // console.log(value.body, 'admin,btn11');
          this.pageHeader.prevAndNext = {
            ...value.body,
          };
          break;

        case EventType.Close:
          console.log('EventType.Close');
          break;
        case EventType.Lodding:
          console.log('EventType.Lodding');
          break;
        case EventType.Stat:
          console.log('EventType.Stat');
          // this.loadStat();
          break;
        case EventType.Alert:
          const level = value.body.level || 'info';
          this.notification.create(level, value.body.content, '', {
            //nzClass: `reset-ant-notification-notice-${level}`,
            nzClass: 'notification-gray',
          });
          break;
        case EventType.Message:
          const levelMessage: keyof typeof this.nzMessage = value.body.level || 'info';
          //type T=keyof typeof this.nzMessage;

          // this.nzMessage[levelMessage](value.body.content);
          //.call(this.nzMessage, value.body.content);
          // this.nzMessage[levelMessage].call(this.nzMessage)
          //(this.nzMessage[levelMessage] as method).call(this.nzMessage, value.body.content);
          Reflect.apply(this.nzMessage[levelMessage], this.nzMessage, [value.body.content])
          break;
        default:
          break;
      }
    });
    this.subscription.push(sub);
    const subRouter = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        // this.checkManager().subscribe((res) => {
        //   if (!res) {
        //     this.router.navigateByUrl('/login?err=sign');
        //     return
        //   }
        //   let url = this.formatUrl(e.url);
        //   // let rt: any = util.findOne(this.activatedRoute.routeConfig.children, {path: url});
        //   // if (!rt) return;
        //   // console.log('路由change主----', this.router.url);
        //   let title = this.getTitle(url);
        //   // console.log('title---->', url, title);
        //   this.setTitle(title);
        //   this.urlDashboard();
        // })
        // if (!this.checkManager()) {
        //   // this.alert.error('签名失败，重新登录');
        //   this.router.navigateByUrl('/login?err=sign');
        //   return
        // }
        // let url = this.formatUrl(e.url);
        // // let rt: any = util.findOne(this.activatedRoute.routeConfig.children, {path: url});
        // // if (!rt) return;
        // // console.log('路由change主----', this.router.url);
        // let title = this.getTitle(url);
        // console.log('title---->', url, title);
        // this.setTitle(title);
        // this.urlDashboard();
        // adminRouterEvent.emit(EventType.AdminRouter, {url: e.url});
      }
    });
    this.subscription.push(subRouter);

    // this.loadStat();

  }

  openChange(menu: any) {
    menu.open = !menu.open;
  }

  ngAfterViewInit() {
    this.initManager();
    this.changeRef.detectChanges();
  }


  override ngOnInit() {
    // const module = await import('@angular/platform-browser/animations');
    // const moduleFactory = await this.compiler.compileModuleAsync(module.BrowserAnimationsModule);
    // const moduleRef = moduleFactory.create(this.injector);
    this.urlDashboard();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    //this.routerEventsListener.unsubscribe();
  }

  urlDashboard() {
    const path = this.router.routerState.snapshot.url;
    if (path === '/admin/dashboard') {
      this.isDashboard = true;
    } else {
      this.isDashboard = false;
    }
  }

  open(menu: any) {
    if (!menu.children || menu.children.length == 0) return false;
    for (let child of menu.children) {
      // console.log('this.router.url', child.path, this.router.url);
      if (child.path == this.router.url) return true;
    }

    return false;
  }

  initManager() {
    for (let menu of this.manager.menu) {
      menu.open = false;
      if (!menu.children || menu.children.length == 0) continue;
      for (let child of menu.children) {
        // console.log('this.router.url', child.path, this.router.url);
        if (child.path == this.router.url) {
          menu.open = true;
          break;
        }
      }
    }
    // console.log(this.manager, 'this.manager');
  }

  goBack() {
    if (this.pageHeader.backUrl == '-1') {
      //上一页
    } else {
      //切换url
      console.log('goBack', this.pageHeader.backUrl);
      this.router.navigateByUrl(this.pageHeader.backUrl);
    }
  }

  goToPath(url?: string, query?: any, type?: any) {
    if (!url) return;
    // this.router.navigateByUrl(url);
    let params = {};
    if (type == 'after') {
      params = {
        id: this.pageHeader?.prevAndNext?.after?.id,
        pageName: this.pageHeader?.prevAndNext?.after?.pageName,
      };
    }

    if (type == 'before') {
      params = {
        id: this.pageHeader?.prevAndNext?.before?.id,
        pageName: this.pageHeader?.prevAndNext?.before?.pageName,
      };
    }
    this.router.navigate([url], {
      queryParams: {
        ...query,
        ...params,
      },
    });
  }

  formatUrl(url: string): string {
    let m = /^(\/admin\/[^\?]+)/gi.exec(url);
    if (!m || m.length < 2) return '';
    return m[1];
  }

  getTitle(url: string) {
    for (let m1 of this.manager.menu) {
      if (m1.path == url) return m1.title;
      if (!m1.children || m1.children.length == 0) continue;
      for (let m2 of m1.children) {
        if (m2.path == url) return m2.title;
      }
    }
    return '';
  }

  logout() {
    let data: any = {
      "query": `query Query {
        logout
      }`,
      "variables": null
    }


    console.log('data', data)

    this.http
      .post('/', data)
      .subscribe((res: any) => {
        if (res.errors) {
          return this.alert.error(res.errors[0].message);
        }
        util.ls.remove('manager');
        this.router.navigateByUrl('/login');
        return
      });

 
  }

  // loadStat() {
  //   this.http.post('/admin/message/findNew', { role: this.manager.role }).subscribe(res => {
  //     if (res.err) return;
  //     // this.stat=res.data;
  //     this.stat.inform = res?.data.inform;
  //     this.stat.message = res?.data.message;
  //   });
  // }





  // fetch 更新信息
  fetchUpdateProfile(params: any) {
    return this.http.post('/admin/manager/updateProfile', params);
  }

  // fetch 更新密码
  fetchUpdatePassword(params: any) {
    return this.http.post('/admin/manager/updatePassword', params);
  }
}
