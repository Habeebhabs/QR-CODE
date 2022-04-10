import { Component,OnInit,AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit,AfterViewInit {

  constructor() { }

  loaderStatus: string = 'block';
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.loaderStatus = 'none',5000)
  }

}
