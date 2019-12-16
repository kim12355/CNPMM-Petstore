import { CardShopComponent } from './card-shop/card-shop.component';

import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router"
import { AuthService } from "angularx-social-login";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification'

import axios from 'axios'
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.less']
})
export class ProductListComponent implements OnInit {
  @Output() linkTo: EventEmitter<any> = new EventEmitter()

  constructor(
    private router: Router,
    private notification: NzNotificationService,
  ) { }

  @ViewChild('container', {
    read: ViewContainerRef,
    static: true
  }) container: ViewContainerRef;

  componentRef: ComponentRef<CardShopComponent>;

  renderCard(input) {
    const container = this.container;
    // container.clear();
    const injector = container.injector;
    const cfr: ComponentFactoryResolver = injector.get(ComponentFactoryResolver);
    const componentFactory = cfr.resolveComponentFactory(CardShopComponent);
    // const componentRef = container.createComponent(componentFactory, container.length, injector);
    const componentRef = container.createComponent(componentFactory, 0, injector);
    componentRef.instance.data = input
    // componentRef.changeDetectorRef.detectChanges();
    this.componentRef = componentRef;
  }


  isSpinning = true
  tokenFromStorage = JSON.parse(localStorage.getItem('token'));
  token = this.tokenFromStorage ? this.tokenFromStorage : 'randomshittoken'; // your token


  search(e): void {
    if (e.key === 'Enter') {
      if (e.target.value === '') {
        this.loadPetData()
      }
      else {
        const container = this.container;
        container.clear();
        axios({
          method: 'GET',
          url: `http://localhost:8080/api/petshop/pets/search/${e.target.value}?token=${this.token}`,
        }).then((res) => {
          res.data.map((v, k) => {
            this.renderCard(v)
          })
        })
      }
    }
  }

  loadPetData(): void {
    this.isSpinning = true
    const container = this.container;
    container.clear();
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/petshop/pets?token=${this.token}`,
    })
      .then((response: any) => {
        if (response.data.success === false) {
          this.notification.config({
            nzPlacement: 'bottomRight'
          })
          this.router.navigateByUrl('/login')
          this.notification.create(
            'error',
            'Bạn chưa đăng nhập !',
            ""
          )
        } else {
          response.data.map((v, k) => {
            this.renderCard(v)
          })
          this.isSpinning = false
        }
      })
  }

  goToDetail(): void {
    this.linkTo.emit('detail')
  }

  ngOnInit() {
    this.loadPetData()
  }

}
