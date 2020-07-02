import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Artist } from '../../classes/artist';
import { Album } from '../../classes/album';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  id: string;
  artist: Artist;
  albums: Album[];

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
  ) {}

  ngOnInit(): void {
    // this runs after "SpotifyResolver" resolves the observable "SpotifyService.tokenObservable"
    //const resolvedData = this.route.snapshot.data; // not used
    this.id = this.route.snapshot.paramMap.get('id');

    // get artist data
    this.spotifyService.spotifyGetArtist(this.id).subscribe({
      next: (artistData: any) => {
        console.log({ artistData });
        this.artist = artistData;
      },
      error: err => this.spotifyService.spotifyError(err, "artists")
    });

    // get artist albums data
    this.spotifyService.spotifyGetArtistAlbums(this.id).subscribe({
      next: (albumsData: any) => {
        console.log({ albumsData });
        this.albums = albumsData.items;
      },
      error: err => this.spotifyService.spotifyError(err, "artist albums")
    });
  }

}
