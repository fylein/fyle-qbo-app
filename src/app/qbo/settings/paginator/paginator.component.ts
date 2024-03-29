import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  pageSize: number;
  multiplier: number;
  tableDimension: number;
  @Input() pageNumber: number;
  @Input() isLoading: boolean;
  @Input() count: number;
  @Input() is3D: boolean;
  @Output() getMappings = new EventEmitter<object>();

  constructor(private storageService: StorageService, private route: ActivatedRoute) { }

  getParentMappings() {
    const that = this;
    const data = {
      pageSize: that.multiplier * that.pageSize,
      pageNumber: that.pageNumber,
      tableDimension: that.tableDimension
    };
    that.getMappings.emit(data);
  }

  onPageChange(event) {
    const that = this;
    if (that.pageSize !== event.pageSize) {
      that.storageService.set('mappings.pageSize', event.pageSize);
    }
    that.pageSize = event.pageSize;
    that.pageNumber = event.pageIndex;
    that.getParentMappings();
  }

  ngOnInit() {
    const that = this;
    that.route.params.subscribe(() => {
      that.pageSize = that.storageService.get('mappings.pageSize') || 50;
      that.multiplier = that.is3D ? 2 : 1;
      that.tableDimension = that.is3D ? 3 : 2;
    });
  }
}
