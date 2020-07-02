import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Artist } from '../../classes/artist';
import { Track } from '../../classes/track';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchQuery: string = '';
  dataArtists: Artist[];
  dataTracks: Track[];

  private timeout = null;
  private waitAfterTyping: number = 500;

  constructor(
    private spotifyService: SpotifyService,
  ) {}

  ngOnInit(): void {
    // this runs after "SpotifyResolver" resolves the observable "SpotifyService.tokenObservable"
    //const resolvedData = this.route.snapshot.data; // not used
  }

  searchMusic() {
    // wait for the user to stop typing, before triggering the search
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      // avoid calling the Spotify API with an empty query
      if (!this.searchQuery.trim()) {
        this.dataArtists = [];
        this.dataTracks = [];
        return false;
      }
      this.spotifyService.spotifySearch(this.searchQuery).subscribe({
        next: (searchData: any) => {
          console.log({ searchData });
          this.dataArtists = searchData.artists.items;
          this.dataTracks = searchData.tracks.items;
        },
        error: err => this.spotifyService.spotifyError(err, "search")
      });
    }, this.waitAfterTyping);
  }

}
