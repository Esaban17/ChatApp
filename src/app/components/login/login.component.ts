import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('successSwal') private successSwal: SwalComponent;
  @ViewChild('errorEmail') private errorEmail: SwalComponent;
  @ViewChild('errorPassword') private errorPassword: SwalComponent;

  constructor() { 
    this.loadScript('assets/vendors/jquery/jquery-3.5.0.min.js');
    this.loadScript('assets/vendors/bootstrap/bootstrap.bundle.min.js');
    this.loadScript('assets/vendors/magnific-popup/jquery.magnific-popup.min.js');
    this.loadScript('assets/vendors/svg-inject/svg-inject.min.js');
    this.loadScript('assets/vendors/modal-stepes/modal-steps.min.js');
    this.loadScript('assets/vendors/emojione/emojionearea.min.js');
    this.loadScript('assets/js/app.js');
  }

  ngOnInit(): void {
  }

  public loadScript(url: string) {
    const body = document.body as HTMLInputElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

}
