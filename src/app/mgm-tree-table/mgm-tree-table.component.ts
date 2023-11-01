import { Component, OnDestroy, OnInit } from '@angular/core';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { WebSocketService } from '../web-socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'mgm-tree-table',
  templateUrl: './mgm-tree-table.component.html',
  styleUrls: ['./mgm-tree-table.component.css'],
})
export class MgmTreeTableComponent implements OnInit, OnDestroy {
  isConnected = false;
  mainTable!: Tabulator;
  productData: any;
  singleProduct: any;
  updatedRecord: any[] = [];

  constructor(private service: WebSocketService, private router: Router) {}

  ngOnInit(): void {
    this.service.connect('ws://172.16.6.47:8080');

    this.service.onOpen((index: number | null) => {
      this.service.sendReadRequest(index);
    });

    this.service.onClose((data: any) => {
      // console.log('WebSocket connection closed');
    });

    this.service.onError((error, index) => {
      console.error(index, 'WebSocket error:', error);
    });

    this.service.onMessage((message) => {
      console.log('Received message from server:', message);
      if (message?.action && message?.action == 'edit') {
        console.log(message.rowIndex);
        if (message.product) {
          this.mainTable.updateData([message.product]);
        }
      } else {
        this.productData = message.products
          ? message.products
          : message
          ? message
          : [];
        this.initTabulator();
      }
    });
  }

  initTabulator() {
    this.mainTable = new Tabulator('#example-table', {
      data: this.productData,
      dataTree: true,
      layout: 'fitColumns',
      dataTreeChildField: 'children',
      dataTreeElementColumn: 'title',
      dataTreeChildIndent: 15,
      dataTreeStartExpanded: false,
      columns: [
        {
          title: 'Product Name',
          field: 'title',
          editor: 'input',
          editable: false,
          cellDblClick: function (e, cell) {
            cell.edit(true);
          },
        },
        {
          title: 'Category',
          field: 'category',
          editable: false,
          cellDblClick: function (e, cell) {
            cell.edit(true);
          },
          editor: 'input',
        },
        {
          title: 'Brand',
          field: 'brand',
          editable: false,
          cellDblClick: function (e, cell) {
            cell.edit(true);
          },
          editor: 'input',
        },
        {
          title: 'Price',
          field: 'price',
          editable: false,
          cellDblClick: function (e, cell) {
            cell.edit(true);
          },
          editor: 'number',
          formatter: 'money',
        },
        {
          title: 'Discount',
          field: 'discountPercentage',
          editable: false,
          cellDblClick: function (e, cell) {
            cell.edit(true);
          },
          editor: 'number',
        },
        {
          title: 'Rating',
          field: 'rating',
          editable: false,
          cellDblClick: function (e, cell) {
            cell.edit(true);
          },
          editor: 'star',
          formatter: 'star',
        },
        {
          title: 'Stock',
          field: 'stock',
          editable: false,
          cellDblClick: function (e, cell) {
            cell.edit(true);
          },
          editor: 'number',
        },
        {
          title: 'Action',
          field: 'id',
          formatter: function (cell, formatterParams) {
            var value = cell.getValue();
            return (
              "<a href='/product-detail/" +
              value +
              "' style='color:#3FB449; font-weight:bold;'>" +
              value +
              '</span>'
            );
          },
          width: 30,
          hozAlign: 'center',
        },
      ],
    });

    if (this.mainTable) {
      const self = this;
      this.mainTable.on('rowClick', function (e, row) {
        self.singleProduct = row.getData();
        // if (self.singleProduct) {
        //   self.router.navigate(['/product-detail/' + self.singleProduct.id]);
        // }
      });
      this.mainTable.on('cellEdited', function (cell) {
        const rowIndex = cell.getRow().getIndex();
        self.sendData(rowIndex, cell.getData());
      });
    }
  }

  sendData(rowIndex: number, data: any) {
    const readRequest = {
      action: 'edit',
      product: data,
      rowIndex: rowIndex,
    };
    this.service.send(readRequest, null);
    // this.service.sendReadRequest();
  }

  onClose() {
    this.service.close();
  }

  ngOnDestroy(): void {
    // this.service.close();
  }
}
