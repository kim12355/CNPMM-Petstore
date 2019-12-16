import { OrdersComponent } from './../pages/orders/orders.component';

import { CardShopComponent } from './../pages/selling/product-list/card-shop/card-shop.component';
import { ProductListComponent } from './../pages/selling/product-list/product-list.component';
import { DetailComponent } from './../pages/selling/detail/detail.component';
import { CartComponent } from './../pages/selling/cart/cart.component';
import { MenuComponent } from './../pages/menu/menu.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

// social login
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

//pages import
import { LoginComponent } from 'src/pages/login/login.component';
import { DasboardComponent } from 'src/pages/dasboard/dasboard.component';
import { RegisterComponent } from 'src/pages/login/register/register.component';
import { CardComponent } from 'src/pages/pets/card/card.component';

import { PetsComponent } from 'src/pages/pets/pets.component';
import { MyaccountComponent } from 'src/pages/myaccount/myaccount.component';
import { CustomersComponent } from 'src/pages/customers/customers.component';
import { ListcustomersComponent } from 'src/pages/listcustomers/listcustomers.component';
import { AvatarComponent } from 'src/pages/avatar/avatar.component';
import { PermissionsComponent } from 'src/pages/permissions/permissions.component';
import { SellingComponent } from 'src/pages/selling/selling.component';



registerLocaleData(en);

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("613166740770-7m3qgrvnpvrr32fg9pajit42efk40ts1.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("426710484570391")
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DasboardComponent,
    RegisterComponent,
    CardComponent,
    PetsComponent,
    MyaccountComponent,
    CustomersComponent,
    ListcustomersComponent,
    AvatarComponent,
    PermissionsComponent,
    MenuComponent,
    SellingComponent,
    CartComponent,
    DetailComponent,
    ProductListComponent,
    CardShopComponent,
    OrdersComponent
  ],
  imports: [
    SocialLoginModule,
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NzLayoutModule,
    AngularFontAwesomeModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [CardComponent, CardShopComponent]
})
export class AppModule { }
