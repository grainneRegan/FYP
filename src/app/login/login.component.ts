import { Component } from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
   title = 'FYP';
      //Form variables
    registerForm:any = FormGroup;
    submitted = false;
    constructor( private formBuilder: FormBuilder, private router:Router){}
    //Add user form actions
    get f() { return this.registerForm.controls; }
    onSubmit() {

      this.submitted = true;
      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }
      //True if all the fields are filled
      if(this.submitted)
      {
        alert("Great!!");
      }

    }
      ngOnInit() {
        //Add User form validations
        this.registerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
        });
      }
}
