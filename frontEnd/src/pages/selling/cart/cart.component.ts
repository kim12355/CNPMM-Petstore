
import { Component, OnInit, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import axios from 'axios'
import { Router } from "@angular/router"
import { NzNotificationService } from 'ng-zorro-antd/notification'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartComponent implements OnInit {
  @Output() linkTo: EventEmitter<any> = new EventEmitter()
  cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  totalPrice
  tokenFromStorage = JSON.parse(localStorage.getItem('token'));
  token = this.tokenFromStorage ? this.tokenFromStorage : 'randomshittoken'; // your token
  currentUser = JSON.parse(localStorage.getItem('currentUser'))
  
  
  
  constructor(
    private notification: NzNotificationService,
    private router: Router,
  ) { }

  removeItem(id): void {
    let newCart = this.cart.filter(v => v._id !== id)
    this.cart = newCart
    this.totalPrice = this.cart.reduce((a, b) => a + b.price * 1, 0)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  continueShopingClick(): void {
    this.router.navigateByUrl('/shopping')
    this.linkTo.emit('home')
  }

  confirmOrderHandler(): void {
    const { _id: id_user,  photoUrl: userImage, name} = this.currentUser
    
    axios({
      method: 'POST',
      url: `http://localhost:8080/api/petshop/orders?token=${this.token}`,
      data: {
        id_user,
        userImage,
        name,
        listProduct: this.cart,
      }
    }).then((res) => {
      console.log(res);
      localStorage.removeItem('cart')
      this.cart = []
      this.totalPrice = 0
      this.notification.config({
        nzPlacement: 'bottomRight'
      })
      this.notification.create(
        'success',
        'Đơn hàng của bạn đã được gửi cho admin xác nhận !',
        ""
      )
    })
  }

  ngOnInit() {
    this.totalPrice = this.cart.reduce((a, b) => a + b.price * 1, 0)
  }

}
