import { Component, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { newPost, post } from '../../types';
import { BlogService } from '../../services/BlogService';

@Component({
  selector: 'create-post',
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
  imports: [ReactiveFormsModule]
})
export class CreatePost {
  constructor(private blogService: BlogService) {}
  
  showForm = model<boolean>(false);
  updatedPosts = output<post[]>();

  newPostGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required)
  });

  createPost() {
    const body: newPost = {
      title: this.newPostGroup.value.title!,
      content: this.newPostGroup.value.content!,
      tags: ['New Post'],
      category: 'General'
    }

    this.blogService.createPost(body).subscribe(val => {
      this.updatedPosts.emit(val)
      this.hideForm();
      this.newPostGroup.setValue({
        title: '',
        content: ''
      });
    });

  }

  hideForm(): void {
    this.showForm.update(() => !this.showForm());
  }
}
