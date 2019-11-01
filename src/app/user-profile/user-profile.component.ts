import { Component, OnInit } from '@angular/core';
import { UserProfileService, UserInfo, Document, Address } from './user-profile.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  hasResponse:boolean;
  userInfo: UserInfo;

  constructor(private profileService: UserProfileService, private errorHandler: ErrorHandlerService) { 
    this.userInfo = new UserInfo();

    this.hasResponse = false;
    this.profileService.getMe().then(resp => {
      this.hasResponse = true;
      this.userInfo = resp;
    }).catch(error => {
      this.hasResponse = true;
      this.errorHandler.handle(error);  
    });
  }

  ngOnInit() {
  }

  save(f) {

  }

}
