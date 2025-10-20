import { Component, ElementRef, EnvironmentInjector, inject, runInInjectionContext, Signal, signal, ViewChild } from '@angular/core';
import { BlogService } from '../services/BlogService';
import { post } from '../types';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, of } from 'rxjs';
import { CreatePost } from './create-post/create-post';

@Component({
  selector: 'posts',
  templateUrl: './posts.html',
  styleUrl: './posts.scss',
  imports: [CreatePost]
})
export class Posts {
  @ViewChild('postIdInput') postIdInput!: ElementRef<HTMLInputElement>;
  @ViewChild('termInput') term!: ElementRef<HTMLInputElement>;

  showCreateForm = false;
  loading = signal(false);
  posts: Signal<post[] | undefined>;

  private environmentInjector = inject(EnvironmentInjector);

  constructor(private blogService: BlogService) {
    this.posts = toSignal(blogService.getPosts());
  }

  handleUpdatePosts(data: post[]) {
    runInInjectionContext(this.environmentInjector, () => {
      this.posts = toSignal(of(data));
    });
  }
  
  showCreatePost(): void {
    this.showCreateForm = true;
  }

  getPosts() {
    this.loading.set(true);

    runInInjectionContext(this.environmentInjector, () => {
      this.posts = toSignal(this.blogService.getPosts().pipe(        
        finalize(() => {
          this.loading.set(false);
        })
      ));
    })
  }
  
  getPostById(): void {
    const postId = Number.parseInt(this.postIdInput.nativeElement.value);
    this.loading.set(true);

    runInInjectionContext(this.environmentInjector, () => {
      this.posts = toSignal(this.blogService.getPostById(postId).pipe(
        finalize(() => this.loading.set(false))
      ));
    })
  }

  getPostsByTerm(): void {
    const term = this.term.nativeElement.value;
    this.loading.set(true);

    runInInjectionContext(this.environmentInjector, () => {
      this.posts = toSignal(this.blogService.searchPosts(term).pipe(
        finalize(() => this.loading.set(false))
      ));
    })
  }

  postsCount() {
    if (this.posts() !== undefined) {
      return this.posts()!.length
    } 
    
    return 0;
  }
}
