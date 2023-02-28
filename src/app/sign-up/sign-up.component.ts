import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  constructor(
    public authService: AuthService
  ) { }
  ngOnInit() { }
}


// import { Component } from '@angular/core';
// import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
// import {Router} from '@angular/router';
//
// @Component({
//   selector: 'app-sign-up',
//   templateUrl: './sign-up.component.html',
//   styleUrls: ['./sign-up.component.css']
// })
// export class SignUpComponent {
//   title = 'FYP';
//     //Form variables
//   registerForm:any = FormGroup;
//   submitted = false;
//   constructor( private formBuilder: FormBuilder, private router:Router){}
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
//   ngOnInit() {
//     //Add User form validations
//     this.registerForm = this.formBuilder.group({
//     email: ['', [Validators.required, Validators.email]],
//     password: ['', [Validators.required]]
//     });
//   }
// }
