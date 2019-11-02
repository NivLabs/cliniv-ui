import { Component, OnInit } from '@angular/core';
import { UserProfileService, UserInfo, Document, Address } from './user-profile.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public loading = true;
  userInfo: UserInfo;

  constructor(private profileService: UserProfileService, private errorHandler: ErrorHandlerService) { 
    this.userInfo = new UserInfo();

    this.profileService.getMe().then(resp => {
      this.loading = false;
      this.userInfo = resp;
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error);  
    });
  }

  ngOnInit() {
  }

  save(f) {

  }

}
