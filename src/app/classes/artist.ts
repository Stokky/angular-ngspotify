import { Album } from './album';

export class Artist {
    id: number;
    name: string;
    genres: any[];
    images: any[];
    albums: Album[];
}
