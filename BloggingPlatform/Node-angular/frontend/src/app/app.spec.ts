import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { BlogService } from './services/BlogService';
import { HttpClient } from '@angular/common/http';
import { post } from './types';
import { of } from 'rxjs';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, blogging-platform-app');
  });
});

describe('BlogService', () => {
  let blogService: BlogService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    blogService = new BlogService(httpClientSpy);
  })

  it('should use BlogService and return post[] ', (done: DoneFn) => {
    const expectedFirst: post = {
      "id": 1,
      "title": "His mother had always taught him",
      "content": "His mother had always taught him not to ever think of himself as better than others. He'd tried to live by this motto. He never looked down on those who were less fortunate or who had less money than him. But the stupidity of the group of people he was talking to made him change his mind.",
      "tags": [
        "history",
        "american",
        "crime"
      ],
      "reactions": {
        "likes": 192,
        "dislikes": 25
      },
      "views": 305,
      "userId": 121,
      "category": "history"
    };

    httpClientSpy.get.and.returnValue(of<post[]>(expectedFirst));

    blogService.getPosts().subscribe({
      next: (posts) => {
        expect(posts[0]).withContext('expected posts index 0').toEqual(expectedFirst);
        done();
      },
      error: done.fail,
    })

    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  })
});