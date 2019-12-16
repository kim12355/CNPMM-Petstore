import { async } from '@angular/core/testing';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from "@angular/router"
import { AuthService } from "angularx-social-login";
import { NzNotificationService } from 'ng-zorro-antd/notification'
import axios from 'axios'

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.less']
})
export class PermissionsComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notification: NzNotificationService,
  ) { }

  token = JSON.parse(localStorage.getItem('token'));
  currentUser = JSON.parse(localStorage.getItem('currentUser'))
  photoUrl = this.currentUser.photoUrl ? this.currentUser.photoUrl : ''
  account
  accounts = []
  arrayPermissions = []
  PERMISSIONS = [
    'LOCKED',
    'PET_SEE',
    'PET_ADD',
    'PET_EDIT',
    'PET_DELETE',
    'CUSTOMER_SEE',
    'CUSTOMER_ADD',
    'CUSTOMER_EDIT',
    'CUSTOMER_DELETE',
  ]

  loadingUpdate = false

   updatePermissions = async () => {

    const switchList = window.document.querySelectorAll('.switch')
    const cols = this.accounts.length
    let array = []
    switchList.forEach((e, k) => {
      array.push(e.firstElementChild.classList.contains('ant-switch-checked'))
      if ((k + 1) % cols === 0) {
        this.arrayPermissions.push(array)
        array = []
      }
    })

    await this.accounts.map( (v, k) => {
      const role = this.arrayPermissions.map((v) => {
        return v[k]
      }).map((val, i) => {
        if (val === true)
          return this.PERMISSIONS[i]
      })

      const lock = role.indexOf('LOCKED') > -1 ? true:false
      console.log(lock)

      axios({
        method: 'PUT',
        url: `http://localhost:8080/api/petshop/accounts/${v._id}?token=${this.token}`,
        data: {
          role,
          lock
        }
      }).then(() => {
        this.arrayPermissions = []
      })
    })
    this.notification.config({
      nzPlacement: 'bottomRight'
    })
    this.notification.create(
      'success',
      'Updated permissions  !',
      ""
    )
  }


  logoutClick(): void {
    localStorage.clear()
    this.authService.signOut()
    this.router.navigateByUrl('/login')
  }

  petsPage(): void {
    this.router.navigateByUrl('/pets')

  }
  ordersPage(): void{
    this.router.navigateByUrl('/orders')
  }

  menuClick(e): void {
    console.log(e)
  }

  dashboardPage(): void {
    this.router.navigateByUrl('/dashboard')
  }
  permissionsPage(): void {
    this.router.navigateByUrl('/permissions')
  }

  customersPage(): void {
    this.router.navigateByUrl('/customers')
  }

  myaccountPage(): void {
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
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/petshop/accounts?token=${this.token}`,
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
          this.accounts = response.data.filter(x => x.role.indexOf('admin') === -1)
          axios({
            method: 'GET',
            url: `http://localhost:8080/api/petshop/current?token=${this.token}`

          })
            .then((response: any) => {
              axios({
                method: 'GET',
                url: `http://localhost:8080/api/petshop/accounts/${response.data.id}?token=${this.token}`

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