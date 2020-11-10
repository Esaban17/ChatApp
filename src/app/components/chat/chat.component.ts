import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

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
    document.querySelector('.chat-finished').scrollIntoView({
      block: 'end',               // "start" | "center" | "end" | "nearest",
      behavior: 'auto'          //"auto"  | "instant" | "smooth",
    });
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
