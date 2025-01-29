import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap, retry, catchError } from 'rxjs/operators';
import { util } from 'co-utility';


@Pipe({ name: 'datetime' })
export class DateTimePipe implements PipeTransform {
    transform(value: any, param?: string): string {
        if (!value || value === 0) {
            return '';
        }
        return util.formatDate(value, param || 'YYYY-MM-DD HH:mm:ss');
    }
}


@Pipe({ name: 'orderStatus' })
export class OrderStatusPipe implements PipeTransform {
    transform(value: any): string {
        switch (value) {
            case 1:
                return '成功';
            case -1:
                return '取消';
            default: //0
                return '预订中'
        }
    }
}

