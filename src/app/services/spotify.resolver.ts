import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SpotifyService } from './spotify.service';

@Injectable({
    providedIn: 'root'
})
export class SpotifyResolver implements Resolve<any> {

    constructor(
        private spotifyService: SpotifyService
    ) {}

    resolve(): Observable<any>|Promise<any>|any {
        return this.spotifyService.tokenObservable.pipe(
            // swallow errors from the Spotify API in this resolver
            // -- because they are caught in the constructor of "SpotifyService"
            // -- source:
            // ---- https://stackoverflow.com/a/38665803/11071601
            catchError(err => EMPTY)
        );
    }

}
