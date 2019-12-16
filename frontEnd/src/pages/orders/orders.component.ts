import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { AuthService } from "angularx-social-login";
import { NzNotificationService } from 'ng-zorro-antd/notification'
import axios from 'axios'

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.less']
})
export class OrdersComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private notification: NzNotificationService,
  ) { }

  currentUser = JSON.parse(localStorage.getItem('currentUser'))
  photoUrl = this.currentUser ? this.currentUser.photoUrl : ''
  tokenFromStorage = JSON.parse(localStorage.getItem('token'));
  token = this.tokenFromStorage ? this.tokenFromStorage : 'randomshittoken'; // your token
  account
  ordersData
  isVisibleMiddle = false
  modalData = {}
  currentOrderID = ''
  currentTotalPrice = 0
    currentTime = ''

  openModal(data):void{
    this.isVisibleMiddle = true
    this.modalData = data
    this.currentOrderID = 'Order #' + data._id.substring(1,6)
    this.currentTotalPrice = 0
    data.listProduct.map((v) => {
        this.currentTotalPrice += v.price
    })
    let date = new Date(data.date)
    this.currentTime = date.toLocaleString()
  }
  closeModal():void{
    this.isVisibleMiddle = false
  }

  approveHandler(id):void{
    axios({
      method: 'PUT',
      url: `http://localhost:8080/api/petshop/orders/${id}?token=${this.token}`,
      data:{
        handle: true,
        message: 'Your order is approved !'
      }
    }).then((res) => {
      console.log(res);
      this.loadOrders()
    })

    this.closeModal()
  }

  logoutClick(): void{
    localStorage.clear()
    this.authService.signOut()
    this.router.navigateByUrl('/login')
  }

  petsPage(): void{
    this.router.navigateByUrl('/pets')
  }
  dashboardPage(): void{
    this.router.navigateByUrl('/dashboard')
  }
  permissionsPage(): void{
    this.router.navigateByUrl('/permissions')
  }

  customersPage(): void{
    this.router.navigateByUrl('/customers')
  }

  myaccountPage(): void{
    this.router.navigateByUrl('/myaccount')
  }

  ordersPage(): void{
    this.router.navigateByUrl('/orders')
  }

  checkPermis():void{
    const role = window.document.querySelector('.roleMenu')
   if(this.account.role.indexOf('admin') === -1)
   {
     role.setAttribute("style", "Display: none")
   }

   
    const pet = window.document.querySelector('.petsMenu')
   if(this.account.role.indexOf('PET_SEE') === -1 && this.account.role.indexOf('admin') === -1)
   {
     pet.setAttribute("style", "Display: none")
   }

    const cus = window.document.querySelector('.customersMenu')
   if(this.account.role.indexOf('CUSTOMER_SEE') === -1 && this.account.role.indexOf('admin') === -1)
   {
     cus.setAttribute("style", "Display: none")
   }

    const orders = window.document.querySelector('.ordersMenu')
   if(this.account.role.indexOf('ORDERS_SEE') === -1 && this.account.role.indexOf('admin') === -1)
   {
    orders.setAttribute("style", "Display: none")
   }
  }

  deleteOrder(id):void{
    axios({
      method: 'DELETE',
      url: `http://localhost:8080/api/petshop/orders/${id}?token=${this.token}`,
    }).then((res) => {
      console.log(res);
      this.loadOrders()
    })
  }

  loadOrders():void{
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/petshop/orders?token=${this.token}`,
    }).then((res) => {
        console.log(res.data);
        this.ordersData = res.data.reverse()
    })
  }

  ngOnInit() {
    var token = JSON.parse(localStorage.getItem('token'));
    console.log(token)
    console.log(this.currentUser)
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/petshop/pets?token=${token}`,
    })
      .then((response:any) =>  {
        if(response.data.success === false)
        {
          this.notification.config({
            nzPlacement: 'bottomRight'
          })
          this.router.navigateByUrl('/login')
          this.notification.create(
            'error',
            'Bạn chưa đăng nhập !',
            ""
          )
        }
        else {
          axios({
            method: 'GET',
            url: `http://localhost:8080/api/petshop/current?token=${token}`

          })
            .then((response: any) => {
              axios({
                method: 'GET',
                url: `http://localhost:8080/api/petshop/accounts/${response.data.id}?token=${token}`

              })
                .then((response: any) => {
                  this.account = response.data
                  this.checkPermis()
                  this.loadOrders()
                })
            })
        }
      })

  }

}
