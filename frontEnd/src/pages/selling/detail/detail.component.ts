import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router"
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }
  cartCount
  data
  whichPage = 'detail'
  isAdded

  addToCartHandler(): void {
    let currentCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    let currentPet = JSON.parse(localStorage.getItem('currentPet'))
    if(currentCart.filter(v => v._id === currentPet._id).length === 0){
      currentCart.push(currentPet)
      localStorage.setItem('cart', JSON.stringify(currentCart))
      this.cartCount ++
      this.isAdded = true
    }
  }

  linkTo(page): void{
    this.whichPage = page
  }

  homePage():void{
    this.router.navigateByUrl('/shopping')
  }


  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('currentPet'))
    this.cartCount = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')).length : 0
    let currentCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    let currentPet = JSON.parse(localStorage.getItem('currentPet'))
    if(currentCart.filter(v => v._id === currentPet._id).length === 0){
        this.isAdded = false
    }
    else this.isAdded = true
  }

}
