import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Album } from '../../classes/album';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  id: string;
  album: Album;
  disks: number = 1;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
  ) {}

  ngOnInit(): void {
    // this runs after "SpotifyResolver" resolves the observable "SpotifyService.tokenObservable"
    //const resolvedData = this.route.snapshot.data; // not used
    this.id = this.route.snapshot.paramMap.get('id');

    // get album data
    this.spotifyService.spotifyGetAlbum(this.id).subscribe({
      next: (albumData: any) => {
        console.log({ albumData });
        this.album = albumData;
        const lastTrack = this.album.tracks.items[this.album.tracks.items.length - 1];
        this.disks = lastTrack.disc_number;
      },
      error: err => this.spotifyService.spotifyError(err, "albums")
    });

  }

}
