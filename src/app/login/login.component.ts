import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LogInComponent implements OnInit {
  constructor(
    public authService: AuthService
  ) { }
  ngOnInit() { }
}

// import { Component } from '@angular/core';
// import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
// import {Router} from '@angular/router';
// import { AuthService } from "../../shared/services/auth.service";
//
// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit{
//   title = 'FYP';
//     //Form variables
//   registerForm:any = FormGroup;
//   submitted = false;
//   constructor( private formBuilder: FormBuilder, private router:Router, public authService: AuthService){}
//   //Add user form actions
//   get f() { return this.registerForm.controls; }
//   onSubmit() {
//
//     this.submitted = true;
//     // stop here if form is invalid
//     if (this.registerForm.invalid) {
//         return;
//     }
//     //True if all the fields are filled
//     if(this.submitted)
//     {
//       alert("Great!!");
//     }
//
//   }
//   ngOnInit() { }
//
// //   ngOnInit() {
// //       //Add User form validations
// //       this.registerForm = this.formBuilder.group({
// //       email: ['', [Validators.required, Validators.email]],
// //       password: ['', [Validators.required]]
// //       });
// //     }
// }
