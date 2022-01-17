import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppService } from '../app.service';

@Component({
  selector: 'app-github-repos',
  templateUrl: './github-repos.component.html',
  styleUrls: ['./github-repos.component.scss']
})
export class GithubReposComponent implements OnInit {

  constructor(private appService: AppService) { }

  repoData : any[] = [];
  repoKeyword = new FormControl('');
  alertError : string = '';
  page : number = 1;
  limit : number = 10;
  totalRepos : number = 0

  ngOnInit(): void {
  }

  getRepos(newSearch? : boolean) {
    if ( !this.repoKeyword.value ) {
      this.repoData = [];
      return;
    }
    if ( newSearch != false ) {
      this.page = 1;
    }
  
    let data : object  = {
      q: this.repoKeyword.value,
      limit: this.limit,
      page: this.page
    }

    this.appService.getRepos(data).subscribe(
      res => {
        if ( res.statusCode == 200 ) {
          this.alertError = "";
          this.totalRepos = res['data']['total_count'] / this.limit;
          this.repoData = res['data']['items'];
        } else {
          this.repoData   = [];
          this.alertError = "Cannot find repositories. Please try again.";
        }
      },
      err => {
        this.repoData   = [];
        this.alertError = "Something went wrong.";
      }
    )
  }

  changePage(page : number) {
    this.page = page;
    this.getRepos(false);
  }
}
