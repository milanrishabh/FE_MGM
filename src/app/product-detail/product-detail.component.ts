import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../web-socket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId = 0;
  categoryId = 0;
  product: any;

  constructor(
    private route: ActivatedRoute,
    private service: WebSocketService
  ) {
    this.route.params.subscribe((res) => {
      if (res['id'] && res['categoryId']) {
        this.productId = res['id'];
        this.categoryId = res['categoryId'];
      }
    });
  }

  ngOnInit() {
    this.service.connect(environment.wsEndpoint);

    this.service.onOpen((index: number | null) => {
      this.service.getProductDetail(this.productId, this.categoryId);
    });

    this.service.onClose((data: any) => {
      // console.log('WebSocket connection closed');
    });

    this.service.onError((error, index) => {
      console.error(index, 'WebSocket error:', error);
    });
    const self = this;
    this.service.onMessage((message) => {
      if (message.action) {
        // debugger;
        console.log('Received-detail: ', message);
        if (
          message.action == 'edit' &&
          Number(message.product.id) == Number(self.productId)
        ) {
          if (
            confirm('New changes has been detected, Do you want to update?') ==
            true
          ) {
            self.product = message.product;
          }
        } else if (message.action == 'detail') {
          self.product = message.product;
        }
      }
    });
  }
}
