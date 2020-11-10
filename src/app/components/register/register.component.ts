import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('successSwal') private successSwal: SwalComponent;
  @ViewChild('errorSwal') private errorSwal: SwalComponent;

  registerForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(private formBuilder:FormBuilder, private userService:UserService) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      username: ['',Validators.required],
      email: ['',Validators.compose([
        Validators.required,
        Validators.email
      ])],
      password: ['',Validators.compose([Validators.required, Validators.minLength(8)])]
    })
  }

  register(){
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.register(this.registerForm.value).then((results:any) => {
      this.submitted = false;
      this.loading = false;
      if(results != null){
        this.registerForm.reset();
        this.successSwal.fire();
      }else{
        this.errorSwal.fire();
      }
    });
  }

}
