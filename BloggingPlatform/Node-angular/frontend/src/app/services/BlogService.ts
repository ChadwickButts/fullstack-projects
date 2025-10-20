import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable, Signal } from "@angular/core";
import { newPost, post } from "../types";
import { catchError, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BlogService {
    constructor(private http: HttpClient) { }

    getPosts(): Observable<Array<post>> {
        return this.http.get<Array<post>>('http://localhost:3000/api/posts').pipe(
            catchError(err => {
                console.log(`No posts available.`);
                return [];
            })
        );
    }

    getPostById(id: number): Observable<Array<post>> {
        return this.http.get<Array<post>>(`http://localhost:3000/api/posts/${id}`).pipe(
            catchError(err => {
                console.log(`No posts with id: ${id}`);
                return [];
            })
        );
    }
    
    searchPosts(term: string): Observable<Array<post>> {
        return this.http.get<Array<post>>(`http://localhost:3000/api/posts?term=${term}`).pipe(
            catchError(err => {
                console.log(`No posts with id: ${term}`, err);
                return [];
            })
        );
    }
    
    
    createPost(reqBody: newPost) {
        return this.http.post<Array<post>>(`http://localhost:3000/api/posts`, JSON.stringify(reqBody)).pipe(
            catchError((err: HttpErrorResponse) => {
                console.log(`Failed to create post`, err);
                return [];
            })
        );
    }
}