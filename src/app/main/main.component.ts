import { Component,OnInit,AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit,AfterViewInit {

  constructor() { }

  loaderStatus: boolean = true;
  btnLoader: boolean = false;
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.loaderStatus = false,5000)
  }

}
