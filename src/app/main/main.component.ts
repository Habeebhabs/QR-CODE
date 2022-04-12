import { Component,OnInit,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
// document.getElementById('abc').setAttribute('data-dismiss','modal');
    // setTimeout(() => {
    //   this.btn.nativeElement.setAttribute('data-bs-dismiss','modal');
    //   this.btn.nativeElement.click();
    // }, 6000);
  }

  @ViewChild('check') btn !: ElementRef;



}
