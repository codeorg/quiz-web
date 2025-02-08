import { util } from 'co-utility';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminBase } from '../admin.base';
import { event, EventType, Http } from '../../../service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminModules } from '../admin.modules';
import { OrderStatusPipe, DateTimePipe } from '../admin.pipe';


@Component({
  selector: 'app-user-list',
  imports: [AdminModules, OrderStatusPipe, DateTimePipe],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})

export class OrderListComponent extends AdminBase implements OnInit {

  isUserInfoDrawerShow: boolean = false;
  selectedRow: any;

  // 搜索条件
  search: any = {};
  timer: any = null;

  // 列表
  list: any[] = [];

  // 会员等级
  status = [
    { _id: 0, name: '预订中' },
    { _id: -1, name: '取消' },
    { _id: 1, name: '成功' },
  ];

  // 详情
  info: any = {};
  // 详情 - 抽屉
  infoDrawer: any = {
    visible: false,
    title: '预订详情',
  };

  // 新增&编辑 弹窗参数
  aeModal = {
    visible: false,
    title: '',
    loading: false, // 确定按钮的loading
    type: 0, // 0：新增；1：编辑
  };

  fg!: FormGroup; // 表单


  constructor(
    router: Router,
    http: Http,
    private fb: FormBuilder,
    private nzImageService: NzImageService,
    private notification: NzNotificationService,
    private modalService: NzModalService
  ) {
    super(router, http);
  }

  override ngOnInit(): void {
    this.findList();
  }

  disabledDate(current: Date): boolean {
    let today = util.dayTime(new Date(), 0)
    return current.getTime() < today;
    // differenceInCalendarDays(current, this.today) > 0;

  }

  // 筛选条件的监听
  searchChange(type?: string) {
    if (type === 'input') {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.findList();
      }, 500);
    } else {
      this.findList();
    }
  }



  // init 初始化表单
  initFg() {
    this.fg = this.fb.group({
      name: [null, [Validators.required]],
      mobile: [null, [Validators.required, Validators.pattern('^1\\d{10}')]],
      eta: [null, [Validators.required]],
      _id: [null],
    });
  }

  // init 初始化表单数据
  initData(row: any) {
    this.fg.patchValue({
      name: row.name,
      mobile: row.mobile,
      eta: row.eta,
      _id: row._id,
    });
  }

  // 打开详情
  infoClick(row: any) {
    this.fetchDetail(row._id);
    this.infoDrawer.visible = true;
  }

  // 关闭详情
  infoDrawerClose() {
    this.infoDrawer.visible = false;
    this.info = {};
  }

  // 打开弹窗【新建&编辑】
  aeClick(row?: any) {
    this.initFg();
    if (row) {
      // 编辑
      this.aeModal.type = 1;
      this.aeModal.title = '编辑预订';
      this.initData(row);
      this.aeModal.visible = true;
    } else {
      // 新增
      this.aeModal.type = 0;
      this.aeModal.title = '添加预订';
    }
    this.aeModal.visible = true;
  }

  // 关闭弹窗【新建&编辑】
  aeCancel() {
    this.aeModal.loading = false;
    this.aeModal.visible = false;
  }

  // 确定弹窗【新建&编辑】
  aeOk() {
    if (this.aeModal.loading) return;
    const order = this.fg.getRawValue();

    this.aeModal.loading = true;

    if (this.aeModal.type === 0) {
      // this.insert(order);
    } else if (this.aeModal.type === 1) {
      this.update(order);
    }

  }

  findList() {
    let data: any = {
      "query": `query FindOrders($status: Float, $eta: Float) {
        findOrders(status: $status, eta: $eta) {
          _id
          eta
          mobile
          name
          username
          status
          time
          userId
        }
      }`,
      "variables": { status: this.search.status, eta: !this.search.eta ? null : this.search.eta.getTime() }
    }


    console.log('data', data)

    this.http
      .post('/', data)
      .subscribe((res: any) => {
        if (res.errors) {
          return this.alert.error(res.errors[0].message);
        }
        this.list = res.data.findOrders || [];
        if (this.info && this.info._id) {
          this.info = util.findOne(this.list, { _id: this.info._id })
        }

        return
      });
  }


  update(order: any) {
    let data = {
      "query": `mutation UpdateOrder($mobile: String!, $name: String!, $eta: Float!, $orderId: String!) {
        updateOrder(mobile: $mobile, name: $name, eta: $eta, orderId: $orderId)
      }`,
      "variables": { orderId: order._id, eta: util.dayTime(order.eta, 0), name: order.name, mobile: order.mobile }
    }

    console.log('data', data)

    this.http
      .post('/', data)
      .subscribe((res: any) => {
        this.aeModal.loading = false;
        if (res.errors) {
          return this.alert.error(res.errors[0].message);
        }
        this.aeCancel();
        this.fetchDetail(order._id);
        this.findList();
        //this.selectedSeat=ut
        return this.alert.success('修改成功');
      });
  }

  // fetch 获取详情
  fetchDetail(id: string) {
    let data = {
      "query": `query FindOneOrder($orderId: String!) {
        findOneOrder(orderId: $orderId) {
          _id
          eta
          mobile
          username
          name
          status
          time
          userId
        }
      }`,
      "variables": { orderId: id }
    }

    console.log('data', data)
    this.info = {};
    this.http
      .post('/', data)
      .subscribe((res: any) => {
        this.aeModal.loading = false;
        if (res.errors) {
          return this.alert.error(res.errors[0].message);
        }
        this.info = res.data.findOneOrder;
      });
  }
  approveOrder(orderId: string): void {
    // this.nzMessageService.info('click confirm');
    let data = {
      "query": `mutation ApproveOrder($orderId: String!) {
        approveOrder(orderId: $orderId)
      }`,
      "variables": { orderId: orderId }
    }

    console.log('data', data)

    this.http
      .post('/', data)
      .subscribe((res: any) => {
        if (res.errors) {
          return this.alert.error(res.errors[0].message);
        }
        this.findList();

        return
      });
  }

  cancelOrder(orderId: string): void {
    // this.nzMessageService.info('click confirm');
    let data = {
      "query": `mutation CancelOrder($orderId: String!) {
        cancelOrder(orderId: $orderId)
      }`,
      "variables": { orderId: orderId }
    }

    console.log('data', data)

    this.http
      .post('/', data)
      .subscribe((res: any) => {
        if (res.errors) {
          return this.notification.create('error', res.errors[0].message, '', {
            nzClass: 'notification-gray',
          });
        }
        this.findList();
        //this.fetchDetail(orderId);
        // this.infoDrawerClose()
        return
      });
  }




}