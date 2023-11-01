import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId = 0;
  product: any;

  constructor(
    private route: ActivatedRoute,
    private service: WebSocketService
  ) {
    this.route.params.subscribe((res) => {
      if (res['id']) {
        this.productId = res['id'];
      }
    });
  }

  ngOnInit() {
    this.service.connect('ws://172.16.6.47:8080');

    this.service.onOpen((index: number | null) => {
      this.service.getProductDetail(this.productId);
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
        if (message.action == 'edit' && Number(message.product.id) == Number(self.productId)) {
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
