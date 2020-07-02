import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import {SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET} from '../../private/spotify-keys';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  // Spotify API settings
  // -- source:
  // ---- https://developer.spotify.com/documentation/web-api/quick-start/
  private client_id: string = SPOTIFY_CLIENT_ID;
  private client_secret: string = SPOTIFY_CLIENT_SECRET;

  /**
   * This token is required for calls to the Spotify API
   * (e.g. search, artist)
   * - TO DO: cache "access_token", to avoid requesting it from the Spotify API on every route change
   */
  private access_token: string = '';

  /**
   * This observable is "hot" because it's subscribed to in multiple places:
   * - SpotifyService.constructor (sets the "access_token")
   * - SpotifyResolver.resolve (waits for this observable to be resolved, before initializing certain components)
   */
  public tokenObservable: Observable<Object>;

  constructor(
    private http: HttpClient
  ) {
    this.tokenObservable = this.spotifyGetTokenObservable();
    this.tokenObservable.subscribe({
      next: authData => {
        this.access_token = authData['access_token'] || '';
      },
      error: err => {
        console.log(`--- Spotify authorization error:`);
        console.log({err});
        throw new Error(err.message);
      }
    });
  }

  /**
   * Get the access token from the Spotify API,
   * using the "Client Credentials Flow" method:
   * - https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow
   * @returns Observable ("hot")
   */
  spotifyGetTokenObservable(): Observable<Object> {
    const authTokenEncoded = new Buffer(this.client_id + ':' + this.client_secret).toString('base64');
    const url = 'https://accounts.spotify.com/api/token';
    // the "HttpParams" object is immutable, so all the "set" calls must be chained in the declaration
    const body = new HttpParams()
      .set('grant_type', 'client_credentials');
    const headers = new HttpHeaders()
      .set('Authorization', 'Basic ' + authTokenEncoded);
      //.set('Content-Type', 'application/x-www-form-urlencoded');
    // use "share()" to return a "hot" observable, instead of a "cold" one
    // -- source:
    // ---- https://stackoverflow.com/a/49208686/11071601
    return this.http.post(url, body, {headers}).pipe(share());
  }

  /**
   * Send a GET request to the Spotify API
   * @param url API endpoint plus arguments
   * @returns Observable
   */
  spotifyHttpGet(url: string): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.access_token}`);
    return this.http.get(url, {headers});
  }

  /**
   * Get search results from the Spotify API
   * - https://developer.spotify.com/documentation/web-api/reference/search/search/
   * @param query search string (e.g. "hendrix")
   * @param type search type (e.g. "artist,track")
   * @returns Observable
   */
  spotifySearch(query: string, type='artist,track'): Observable<Object> {
    // encoding spaces with "+" (alternatively, encode spaces with "%20")
    const querySafe = query.replace(/\s/g, '+');
    // the "limit" value is applied within each "type", not on the total response
    const url = `https://api.spotify.com/v1/search?q=${querySafe}&type=${type}&limit=20&offset=0`;
    return this.spotifyHttpGet(url);
  }

  /**
   * Get artist data from the Spotify API
   * - https://developer.spotify.com/documentation/web-api/reference/artists/
   * @param id artist ID
   * @returns Observable
   */
  spotifyGetArtist(id: string): Observable<Object> {
    const url = `https://api.spotify.com/v1/artists/${id}`;
    return this.spotifyHttpGet(url);
  }

  /**
   * Get artist albums data from the Spotify API
   * - https://developer.spotify.com/documentation/web-api/reference/artists/get-artists-albums/
   * @param id artist ID
   * @returns Observable
   */
  spotifyGetArtistAlbums(artistId: string): Observable<Object> {
    const url = `https://api.spotify.com/v1/artists/${artistId}/albums`;
    return this.spotifyHttpGet(url);
  }

  /**
   * Get album data from the Spotify API
   * - https://developer.spotify.com/documentation/web-api/reference/albums/get-album/
   * @param id album ID
   * @returns Observable
   */
  spotifyGetAlbum(id: string): Observable<Object> {
    const url = `https://api.spotify.com/v1/albums/${id}`;
    return this.spotifyHttpGet(url);
  }

  /**
   * Throw and debug Spotify API error
   * @param err Error response from the Spotify API
   * @param spotifyApi API endpoint name
   */
  spotifyError(err: any, spotifyApi: string): void {
    console.log(`--- Spotify "${spotifyApi}" API error:`);
    console.log({err});
    throw new Error(err.message);
  }
}
