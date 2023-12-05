import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { MgmTreeTableComponent } from './mgm-tree-table/mgm-tree-table.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MgmTreeTableComponent,
  },
  {
    path: 'product-detail/:id/:categoryId',
    component: ProductDetailComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
