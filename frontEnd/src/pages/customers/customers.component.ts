import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { AuthService } from "angularx-social-login";
import { NzNotificationService } from 'ng-zorro-antd/notification'
import axios from 'axios'

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.less']
})
export class CustomersComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private notification: NzNotificationService,
  ) { }

  currentUser = JSON.parse(localStorage.getItem('currentUser'))
    account 
  logoutClick(): void{
    localStorage.clear()
    this.authService.signOut()
    this.router.navigateByUrl('/login')
  }

  petsPage(): void{
    this.router.navigateByUrl('/pets')

  }

  menuClick(e): void{
    console.log(e)
  }

  dashboardPage(): void{
    this.router.navigateByUrl('/dashboard')
  }

  customersPage(): void{
    this.router.navigateByUrl('/customers')
  }
  ordersPage(): void{
    this.router.navigateByUrl('/orders')
  }

  permissionsPage(): void{
    this.router.navigateByUrl('/permissions')
  }

  myaccountPage(): void{
    this.router.navigateByUrl('/myaccount')
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
  }


  ngOnInit() {
    var currentUser = JSON.parse(localStorage.getItem('token'));
    var token = currentUser ? currentUser : 'randomshittoken'; // your token
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
        } else {
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
                })
            })
        }
      })
  }

}
