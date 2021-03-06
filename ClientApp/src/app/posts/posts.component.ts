import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URI, Post, User } from '../discussion/model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html'
})

export class PostsComponent {
  private allPosts: Post[];
  private posts: Post[];
  private users: User[];
  public all: boolean = true;

  decoratePosts(posts, users) {
    if (posts && users) {
      for (let user of users) {
        posts.forEach(post => {
          if (post.userId === user.id) {
            post.userName = user.username;
          }
        })
      }
    };
    if (posts) {
      posts.forEach(post => {
        if (!post.userName)
          post.userName = 'unknown';
      });
    }
    return posts;
  }

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    http.get<Post[]>(baseUrl + URI.posts).subscribe(result => {
      this.allPosts = this.decoratePosts(result, this.users);
      this.posts = this.decoratePosts(result, this.users);
    }, error => console.error(error));

    http.get<User[]>(baseUrl + URI.users).subscribe(result => {
      this.users = result;
      this.allPosts = this.decoratePosts(this.allPosts, this.users);
      this.posts = this.decoratePosts(this.allPosts, this.users);
    }, error => console.error(error));
  }

  filterPosts(userId: number) {
    this.all = userId == 0;
    this.posts = this.all ? this.allPosts : this.allPosts.filter((post) => post.userId == userId);
  }
}
