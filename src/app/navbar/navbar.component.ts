import { Component, OnInit, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit,AfterViewInit {

  constructor() { }

  isUserAvailable: boolean = false;
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setInterval(() => {
      this.isUserAvailable = true;
      setTimeout(() => this.isUserAvailable = false,4000);
    },6000)
  }

}
