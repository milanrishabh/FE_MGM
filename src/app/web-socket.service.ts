import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private socketArray: WebSocket[] = [];
  maxCount = 300;

  constructor() {}

  // Connect to the WebSocket server
  connect(url: string): void {
    this.socketArray = [];
    this.socket = new WebSocket(url);
    // for (let index = 0; index < this.maxCount; index++) {
    //   this.socketArray.push(new WebSocket(url));
    //   console.log('Connection Initiated');
    // }
  }

  sendReadRequest(index: number | null): void {
    const readRequest = {
      action: 'read',
    };
    this.send(readRequest, index);
  }

  // Send a message to the server
  send(message: any, index: number | null): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      if (index) {
        this.socketArray[index].send(JSON.stringify(message));
        // console.log('Send Request Message Count: ');
      } else {
        this.socket.send(JSON.stringify(message));
      }
    } else {
      console.error('WebSocket is not open. Cannot send the message.');
    }
  }

  // Close the WebSocket connection
  close(): void {
    if (this.socket) {
      this.socket.close();
    }
    if (this.socketArray.length > 0) {
      for (let index = 0; index < this.socketArray.length; index++) {
        this.socketArray[index].close();
        console.log('Close Connection Count actual event: ');
      }
    }
  }

  // Add event listeners for various WebSocket events
  onOpen(callback: (i: number | null) => void): void {
    this.socket.addEventListener('open', () => {
      callback(null);
    });
    if (this.socketArray.length > 0) {
      for (let index = 0; index < this.socketArray.length; index++) {
        this.socketArray[index].addEventListener('open', () => {
          callback(index);
        });
        console.log('Open Connection Event Count: ');
      }
    }
  }

  onClose(callback: (event: any, index: number | null) => void): void {
    this.socket.addEventListener('close', (event) => {
      callback(event, null);
    });
    if (this.socketArray.length > 0) {
      for (let index = 0; index < this.socketArray.length; index++) {
        this.socketArray[index].addEventListener('close', (event) => {
          callback(event, index);
        });
        // console.log('Close Connection Count Message Event: ');
      }
    }
  }

  onError(callback: (error: Event, index: number | null) => void): void {
    this.socket.addEventListener('error', (event) => {
      callback(event, null);
    });
    if (this.socketArray.length > 0) {
      for (let index = 0; index < this.socketArray.length; index++) {
        this.socketArray[index].addEventListener('error', (event) => {
          callback(event, index);
        });
        // console.log('Error Event Count: ');
      }
    }
  }

  onMessage(callback: (message: any) => void): void {
    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    });
    // if (this.socketArray.length > 0) {
    //   for (let index = 0; index < this.socketArray.length; index++) {
    //     this.socketArray[index].addEventListener('message', (event) => {
    //       const data = JSON.parse(event.data);
    //       callback(data);
    //     });
    //     console.log('Message Send Event Count: ');
    //   }
    // }
  }

  getProductDetail(id: number) {
    const readRequest = {
      action: 'detail',
      productId: id,
    };
    this.send(readRequest, null);
  }
}
