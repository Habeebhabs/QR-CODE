import { Component,OnInit,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Auth,createUserWithEmailAndPassword,signInWithEmailAndPassword,getAuth,onAuthStateChanged, AuthErrorCodes, user } from '@angular/fire/auth';
import { addDoc,Firestore,collection } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { doc, getDocs, updateDoc } from '@firebase/firestore';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit,AfterViewInit {

  constructor(public auth: Auth,public firestore: Firestore) { }

  loaderStatus: boolean = true;
  btnLoader: boolean = false;
  ngOnInit(): void {
    console.log(AuthErrorCodes);
    this.signUpForm.valueChanges.subscribe(value => {
      if(value['userName'] == this.lastTypedUserName) this.userNameErrorCode = true;
      else this.userNameErrorCode = false;
      this.emailErrorCode = false;

    })
  }

  lastTypedUserName :any;
  ngAfterViewInit(): void {
    setTimeout(() => this.loaderStatus = false,5000)
// document.getElementById('abc').setAttribute('data-dismiss','modal');
    // setTimeout(() => {
    //   this.btn.nativeElement.setAttribute('data-bs-dismiss','modal');
    //   this.btn.nativeElement.click();
    // }, 6000);
  }

  @ViewChild('check') btn !: ElementRef;
  userName = new FormControl('',Validators.required);
  
  signUpForm = new FormGroup({
    userName : new FormControl('',Validators.required),
    email : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required)
  })

  emailErrorCode :any;
  userNameErrorCode: any;

  userNameStatus :boolean = true;
  registerUserWithAuth(){
    // const { userName,email,password } = this.mainForm.value;
    this.getFirebaseData(this.signUpForm.controls['userName'].value);
    // setTimeout(() => {
    //   if(this.userNameStatus){
    //     createUserWithEmailAndPassword(this.auth,email,password)
    //     .then((res) => {
    //       this.addData(res.user.uid);
    //     })
    //     .catch((err) => {
    //       console.log(err.code)
    //       if(err.code == AuthErrorCodes.EMAIL_EXISTS) console.log('got it');
    //     })
    //   } 
    //   else{
    //     console.log('username already exists',this.userNameStatus);
    //   }
    // },500)
  }

  signIn(){
    // const auth = getAuth();
    signInWithEmailAndPassword(this.auth,'habeeb@gmail.com','23r34t34')
    .then((res) => {
      console.log(res.user.uid)
      // onAuthStateChanged(auth,(user) => {
      //   if(user){
      //     console.log(user.uid);
      //   }
      //   else{
      //     console.log('no user')
      //   }
      // })
      console.log(AuthErrorCodes)
    })
  }



  addData(userId:any){
    const value = {
      userId: userId,
      userName: this.signUpForm.controls['userName'].value
    }
    const dbinstance = collection(this.firestore,'users');
    addDoc(dbinstance,value)
    .then((response) => {
      console.log('data registered');
    })
    .catch((err) => {
      console.log(err.code)
    })
  }

  getFirebaseData(userName:any){
    const dbinstance = collection(this.firestore,'users');
    getDocs(dbinstance)
    .then((response) => {
        const data:any[] = [...response.docs.map((item:any) => {
          return { ...item.data(), id:item.id }
        })];
        const isAvailable:any[] = data.filter(item => {
          return item.userName.toLowerCase() == userName.toLowerCase();
        })
        if(isAvailable.length == 0){
          this.userNameErrorCode = false;
          const { userName,email,password } = this.signUpForm.value;
          createUserWithEmailAndPassword(this.auth,email,password)
          .then((res) => {
            this.addData(res.user.uid);
            this.emailErrorCode = false;
          })
          .catch((err) => {
            this.lastTypedUserName = this.signUpForm.controls['userName'].value;
            console.log(err.code)
            if(err.code == AuthErrorCodes.EMAIL_EXISTS) console.log('got it');
            this.emailErrorCode = true;
          })
        }
        else{
          console.log('username already exists');
          this.userNameErrorCode = true;
          this.lastTypedUserName = this.signUpForm.controls['userName'].value;
          this.signUpForm.valueChanges.subscribe(value => {
            if(value['userName'] == this.lastTypedUserName) this.userNameErrorCode = true;
            else this.userNameErrorCode = false;
          })
          
        };
    })
    .catch((err) => {
      console.log(err.code)
    })
  }
}
