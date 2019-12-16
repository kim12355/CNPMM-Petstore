import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"

@Component({
  selector: 'app-selling',
  templateUrl: './selling.component.html',
  styleUrls: ['./selling.component.less']
})
export class SellingComponent implements OnInit {

  whichPage = 'home'
  cartCount
  currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : {}

  constructor(
    private router: Router,
  ) { }

    linkTo(name) : void{
      this.whichPage = name
    }

  ngOnInit() {
    this.cartCount = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')).length : 0
  }

}
