import { Component, OnDestroy, OnInit } from '@angular/core';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { WebSocketService } from '../web-socket.service';

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

  constructor(private service: WebSocketService) {}

  ngOnInit(): void {
    this.service.connect('ws://localhost:8080');

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
      // console.log('Received message from server:', message);
      if (message.action && message.action == 'edit') {
        this.mainTable.updateRow(message.rowIndex, message.product);
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
      ],
    });

    if (this.mainTable) {
      const self = this;
      this.mainTable.on('rowClick', function (e, row) {
        self.singleProduct = row.getData();
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
    this.service.close();
  }
}
