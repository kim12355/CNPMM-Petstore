import { CardComponent } from './card/card.component';

import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Output } from '@angular/core';
import { Router } from "@angular/router"
import { AuthService } from "angularx-social-login";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification'

import axios from 'axios'


@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.less']
})
export class PetsComponent implements OnInit {

  @ViewChild('container', {
    read: ViewContainerRef,
    static: true
  }) container: ViewContainerRef;

  componentRef: ComponentRef<CardComponent>;
  account

  renderCard(input) {
    const container = this.container;
    // container.clear();
    const injector = container.injector;
    const cfr: ComponentFactoryResolver = injector.get(ComponentFactoryResolver);
    const componentFactory = cfr.resolveComponentFactory(CardComponent);
    // const componentRef = container.createComponent(componentFactory, container.length, injector);
    const componentRef = container.createComponent(componentFactory, 0, injector);
    componentRef.instance.data = input
    componentRef.instance.account = this.account
    // componentRef.changeDetectorRef.detectChanges();
    this.componentRef = componentRef;
  }

  isVisible = false;
  validateForm: FormGroup;
  tokenFromStorage = JSON.parse(localStorage.getItem('token'));
  token = this.tokenFromStorage ? this.tokenFromStorage : 'randomshittoken'; // your token
  isSpinning = true


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notification: NzNotificationService,
  ) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      age: ['', [Validators.required]],
      vaccine: ['', [Validators.required]],
      price: ['', [Validators.required]],
      character: ['', [Validators.required]],
      img: ['', [Validators.required]],
      provider: ['', [Validators.required]]
    });
  }

  currentUser = JSON.parse(localStorage.getItem('currentUser'))

  submitForm(value: any): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

      const { name, character, gender, vaccine, provider, age, price, img } = value
      console.log(value)
      axios({
        method: 'POST',
        url: `http://localhost:8080/api/petshop/pets?token=${this.token}`,
        data: {
          name,
          character,
          gender,
          vaccineUpToDate: vaccine,
          provider,
          age,
          price,
          img
        }
      })
        .then((response: any) => {
          this.loadPetData()
          this.notification.config({
            nzPlacement: 'bottomRight'
          })
          this.notification.create(
            'success',
            'Đã thêm mới pet !',
            ""
          )

        }).catch(err => {
          this.notification.config({
            nzPlacement: 'bottomRight'
          })
          this.notification.create(
            'error',
            err,
            ""
          )
        })

      this.handleOk()
    
  }



  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  showModal(): void {
    if (this.account.role.indexOf('PET_ADD') === -1 && this.account.role.indexOf('admin') === -1) {
      this.notification.config({
        nzPlacement: 'bottomRight'
      })
      this.notification.create(
        'error',
        'Bạn không có quyền thêm mới pet !',
        ""
      )
    } else {
    this.isVisible = true;
    }
  }


  ordersPage(): void{
    this.router.navigateByUrl('/orders')
  }
  
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
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

  checkPermis(): void {
    const role = window.document.querySelector('.roleMenu')
    if (this.account.role.indexOf('admin') === -1) {
      role.setAttribute("style", "Display: none")
    }


    const pet = window.document.querySelector('.petsMenu')
    if (this.account.role.indexOf('PET_SEE') === -1 && this.account.role.indexOf('admin') === -1) {
      pet.setAttribute("style", "Display: none")
    }

    const cus = window.document.querySelector('.customersMenu')
    if (this.account.role.indexOf('CUSTOMER_SEE') === -1 && this.account.role.indexOf('admin') === -1) {
      cus.setAttribute("style", "Display: none")
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
      .then(async (response: any) => {
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

          await response.data.map((v, k) => {
            this.renderCard(v)
          })
          this.isSpinning = false
        }
      })
  }


  ngOnInit() {

    this.loadPetData()
  }

}
