import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { AuthService } from "angularx-social-login";
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { Observable, Observer } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import axios from 'axios'

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.less']
})
export class MyaccountComponent implements OnInit {
  isVisible = false
  validateForm: FormGroup;
  confirmModal: NzModalRef; // For testing by now
  constructor(
    private router: Router,
    private authService: AuthService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
  ) {
    this.validateForm = this.fb.group({
      name: [''],
      phone: [''],
      address: [''],
      image: [''],
      password: [null],
      checkPassword: [null, [ this.confirmationValidator]],
    });
  }

  currentUser = JSON.parse(localStorage.getItem('currentUser'))
  account 

  detailCurrentUser = {
    firstName: '',
    name: '',
    address: '',
    phone: '',
    image: '',
    email: '',
    _id: ''
  }

  submitForm(value: any): void {
    this.handleOk(value)
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  asyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(value): void {
    var currentUser = JSON.parse(localStorage.getItem('token'));
    var token = currentUser ? currentUser : 'randomshittoken';
    const { name, image, phone, address, password } = value
    axios({
      method: 'PUT',
      url: `http://localhost:8080/api/petshop/accounts/${this.detailCurrentUser._id}?token=${token}`,
      data: {
        name,
        image,
        phone,
        address,
        password,
      }

    })
      .then((response: any) => {
        axios({
          method: 'GET',
          url: `http://localhost:8080/api/petshop/accounts/${this.detailCurrentUser._id}?token=${token}`

        })
          .then((response: any) => {
            const { name, email, address, phone, image, _id } = response.data
            this.detailCurrentUser = {
              firstName: name.split(' ')[0],
              name,
              address,
              phone,
              image,
              email,
              _id
            }
            var newUserUpdate = {
              firstName: name.split(' ')[0],
              name,
              address,
              phone,
              photoUrl: image,
              email,
              _id
            }
            localStorage.setItem('currentUser', JSON.stringify(newUserUpdate));
          })
      }).catch((err) => {
        console.log(err)
      })

    this.isVisible = false;
  }

  handleCancel(): void {

    this.isVisible = false;
  }

  logoutClick(): void {
    localStorage.clear()
    this.authService.signOut()
    this.router.navigateByUrl('/login')
  }

  petsPage(): void {
    this.router.navigateByUrl('/pets')

  }

  menuClick(e): void {
    console.log(e)
  }

  dashboardPage(): void {
    this.router.navigateByUrl('/dashboard')
  }

  customersPage(): void {
    this.router.navigateByUrl('/customers')
  }

  permissionsPage(): void{
    this.router.navigateByUrl('/permissions')
  }

  myaccountPage(): void {
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
  }

  ngOnInit() {
    var currentUser = JSON.parse(localStorage.getItem('token'));
    var token = currentUser ? currentUser : 'randomshittoken'; // your token
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/petshop/pets?token=${token}`,
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
                  
                  const { name, email, address, phone, image, _id } = response.data
                  this.detailCurrentUser = {
                    firstName: name.split(' ')[0],
                    name,
                    address,
                    phone,
                    image,
                    email,
                    _id
                  }

                  
                })
            })
        }
      })
  }

}
