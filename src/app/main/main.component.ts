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
  lastTypedUserName :any;
  lastTypedEmail: any;
  signUpEmailErrorCode :any;
  signUpUserNameErrorCode: any;
  signUpPasswordErrorCode: any;
  signInEmailErrorCode : any;
  signInPasswordErrorCode : any;
  signInErrorCode : any;
  authErrorCodes : any;
  signInBtnLoader : boolean = false;
  signUpBtnLoader : boolean = false;
  @ViewChild('signUpPasswordField') signUpPasswordField !: ElementRef;
  @ViewChild('signInPasswordField') signInPasswordField !: ElementRef;
  @ViewChild('check') btn !: ElementRef;
  signUpForm = new FormGroup({
    userName : new FormControl('',Validators.required),
    email : new FormControl('',Validators.required),
    password : new FormControl('',[Validators.required,Validators.minLength(8)])
  })
  
  signInForm = new FormGroup({
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required)
  })

  ngOnInit(): void {
    console.log(AuthErrorCodes);
    this.authErrorCodes = AuthErrorCodes;
  }


  ngAfterViewInit(): void {
    setTimeout(() => this.loaderStatus = false,5000)
// document.getElementById('abc').setAttribute('data-dismiss','modal');
    // setTimeout(() => {
    //   this.btn.nativeElement.setAttribute('data-bs-dismiss','modal');
    //   this.btn.nativeElement.click();
    // }, 6000);
    
  }


  changePasswordFieldType(type: string,field:any){
    if(field == 'signUpPasswordField') this.signUpPasswordField.nativeElement.type = type;
      //when clicking the icon, input lose focus. Retrieve focus by this => this.signUpPasswordField.nativeElement.focus();
    else this.signInPasswordField.nativeElement.type = type;
    //when clicking the icon, input lose focus. Retrieve focus by this => this.signInPasswordField.nativeElement.focus();
  }
  

  signInUserWithAuth(){
    if(this.signInForm.valid) this.firebaseSignIn();
    else this.signInForm.markAllAsTouched();
  }
    
  registerUserWithAuth(){
    if(this.signUpForm.valid) this.getFirebaseData(this.signUpForm.controls['userName'].value);
    else this.signUpForm.markAllAsTouched();
  }

  firebaseSignIn(){
    this.signInBtnLoader = true;
    const { email,password } = this.signInForm.value
    signInWithEmailAndPassword(this.auth,email,password)
    .then((res) => {
      console.log(res.user.uid);
      this.signInBtnLoader = false;
      alert('sign in success')
    })
    .catch((err) => {
      console.log(err.code)
      if(err.code == AuthErrorCodes.INVALID_EMAIL) this.signInErrorCode = AuthErrorCodes.INVALID_EMAIL;
      if(err.code == AuthErrorCodes.USER_DELETED) this.signInErrorCode = AuthErrorCodes.USER_DELETED;
      if(err.code == AuthErrorCodes.INVALID_PASSWORD) this.signInErrorCode = AuthErrorCodes.INVALID_PASSWORD;
      this.signInBtnLoader = false;
      alert('sign in fail')
    })
  }



  addData(userId:any){
    const value = {
      userId: userId,
      userName: this.signUpForm.controls['userName'].value
    }
    const dbInstance = collection(this.firestore,'users');
    addDoc(dbInstance,value)
    .then((response) => {
      console.log('data registered');
      this.signUpBtnLoader = false;
      alert('data registered');
    })
    .catch((err) => {
      console.log(err.code);
      this.signUpBtnLoader = false;
      alert('data not registered');
    })
  }

  getFirebaseData(userName:any){
    this.signUpBtnLoader = true;
    const dbInstance = collection(this.firestore,'users');
    getDocs(dbInstance)
    .then((response) => {
        const data:any[] = [...response.docs.map((item:any) => {
          return { ...item.data(), id:item.id }
        })];
        const isAvailable:any[] = data.filter(item => {
          return item.userName.toLowerCase() == userName.toLowerCase();
        })
        if(!isAvailable.length){
          this.signUpUserNameErrorCode = false;
          const { userName,email,password } = this.signUpForm.value;
          createUserWithEmailAndPassword(this.auth,email,password)
          .then((res) => {
            this.addData(res.user.uid);
            this.signUpEmailErrorCode = false;
          })
          .catch((err) => {
            if(err.code == AuthErrorCodes.EMAIL_EXISTS){
              this.lastTypedEmail = this.signUpForm.controls['email'].value;
              this.signUpEmailErrorCode = true;
              this.signUpForm.controls['email'].valueChanges.subscribe(value => {
                if(value == this.lastTypedEmail) this.signUpEmailErrorCode = true;
                else this.signUpEmailErrorCode = false;
              })
            }
            this.signUpBtnLoader = false;
          })
        }
        else{
          this.signUpUserNameErrorCode = true;
          this.lastTypedUserName = this.signUpForm.controls['userName'].value;
          this.signUpForm.controls['userName'].valueChanges.subscribe(value => {
            if(value == this.lastTypedUserName) this.signUpUserNameErrorCode = true;
            else this.signUpUserNameErrorCode = false;
          })
          this.signUpBtnLoader = false;
        };
    })
    .catch((err) => {
      console.log(err.code);
      console.log('Network Disconnected')
      this.signInBtnLoader = false;
    })
  }
}
