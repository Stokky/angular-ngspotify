import { Track } from './track';
import { Artist } from './artist';

export class Album {
    artists: Artist[];
    external_urls: {
        spotify: string;
    }
    id: number;
    images: any[];
    name: string;
    release_date: string;
    tracks: {
        items: Track[];
    }
}
