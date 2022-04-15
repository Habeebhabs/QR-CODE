import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public auth:Auth,public router: Router) { }

  mainSpinner : boolean = false;
  isUserAvailable: boolean = false;
  userName: any;
  initial : string = '';
  showSignOutBtnStatus : boolean = false;

  ngOnInit(): void {
    if(localStorage.getItem('currentUser') !== null){
      this.userName = localStorage.getItem('currentUser');
      this.userName.split(' ',2).forEach((item:any) => {
        this.initial += item[0].toUpperCase();
      })
      this.isUserAvailable = true;
    }
    else{
      this.checkForUsers()
    }
  }

  checkForUsers(){
    const interval = setInterval(() => {
      if(localStorage.getItem('currentUser') !== null){
        this.userName = localStorage.getItem('currentUser');
        console.log(this.userName);
        this.userName.split(' ',2).forEach((item:any) => {
          this.initial += item[0].toUpperCase();
        })
        console.log(this.initial);
        this.isUserAvailable = true;
        clearInterval(interval);
      }
    },1000)
  }

  showSignOutBtn(){
    if(this.showSignOutBtnStatus) this.showSignOutBtnStatus = false;
    else this.showSignOutBtnStatus = true;
  }

  signOutUser(){
    this.auth.signOut()
    .then((res) => {
      console.log(res)
      this.mainSpinner = true;
      setTimeout(() => {
        this.showSignOutBtnStatus = false;
        localStorage.clear();
        this.isUserAvailable = false;
        this.checkForUsers();
        console.log('signed out');
        this.mainSpinner = false;
        this.router
        .navigate(['main']);
      }, 3000);
    })
    .catch((err) => {
      console.log(err.code)
    })
  }
}
