import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('successSwal') private successSwal: SwalComponent;
  @ViewChild('errorSwal') private errorSwal: SwalComponent;

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder:FormBuilder,
    private route: ActivatedRoute,
    private router:Router,
    private authenticationService:AuthenticationService
  ) { 
    // redirect to home if already logged in
    if (this.authenticationService.userValue) { 
      this.router.navigate(['/chat']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    });  
      
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(){
    this.submitted = true

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.login(this.loginForm.value).then((res:any) => {
      if(res != null){
        this.submitted = false;
        this.loading = false;
        this.loginForm.reset();
        this.router.navigate(['chat']);
        this.successSwal.fire();
      }else {
        this.submitted = false;
        this.loading = false;
        this.loginForm.reset();
        this.errorSwal.fire();
      }
    });
  }

}
