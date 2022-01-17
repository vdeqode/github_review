import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { AppService } from '../app.service';

@Component({
  selector: 'app-github-users',
  templateUrl: './github-users.component.html',
  styleUrls: ['./github-users.component.scss']
})
export class GithubUsersComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private appService: AppService) { }

  userData : any[] = [];
  userKeyword = new FormControl('');
  alertError : string = '';
  page : number = 1;
  limit : number = 10;
  totalRepos : number = 0

  ngOnInit(): void {
  }
  
  getUsers(newSearch? : boolean) {
    if ( !this.userKeyword.value ) {
      this.userData = [];
      return;
    }

    if ( newSearch != false ) {
      this.page = 1;
    }

    let data : object  = {
      q: this.userKeyword.value,
      limit: this.limit,
      page: this.page
    }

    this.appService.getUsers(data).subscribe(
      res => {
        if ( res.statusCode == 200 ) {
          this.alertError = "";
          this.totalRepos = res['data']['total_count'] / this.limit;
          this.userData = res['data']['items'];
        } else {
          this.userData   = [];
          this.alertError = "Cannot find users. Please try again.";
        }
      },
      err => {
        this.userData = [];
        this.alertError = err['error']['message'];
      }
    )
  }

  changePage(page : number) {
    this.page = page;
    this.getUsers(false);
  }
}
