import { OrdersComponent } from './../pages/orders/orders.component';
import { DetailComponent } from './../pages/selling/detail/detail.component';
import { CartComponent } from './../pages/selling/cart/cart.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/pages/login/login.component';
import { DasboardComponent } from 'src/pages/dasboard/dasboard.component';
import { PetsComponent } from 'src/pages/pets/pets.component';
import { MyaccountComponent } from 'src/pages/myaccount/myaccount.component';
import { CustomersComponent } from 'src/pages/customers/customers.component';
import { PermissionsComponent } from 'src/pages/permissions/permissions.component';
import { SellingComponent } from 'src/pages/selling/selling.component';



const routes: Routes = [
  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'dashboard', pathMatch: 'full', component: DasboardComponent },
  { path: 'pets', pathMatch: 'full', component: PetsComponent },
  { path: 'myaccount', pathMatch: 'full', component: MyaccountComponent },
  { path: 'customers', pathMatch: 'full', component: CustomersComponent },
  { path: 'permissions', pathMatch: 'full', component: PermissionsComponent },
  { path: 'shopping', pathMatch: 'full', component: SellingComponent },
  { path: 'cart', pathMatch: 'full', component: CartComponent },
  { path: 'shopping/detail/:id', pathMatch: 'full', component: DetailComponent },
  { path: 'orders', pathMatch: 'full', component: OrdersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
