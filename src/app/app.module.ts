import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MgmTreeTableComponent } from './mgm-tree-table/mgm-tree-table.component';
// import { SocketIoModule } from 'ngx-socket-io';

@NgModule({
  declarations: [AppComponent, MgmTreeTableComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // SocketIoModule.forRoot({ url: 'ws://localhost:8080' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
