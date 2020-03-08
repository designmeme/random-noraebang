export interface Song {
  id?: number;
  title?: string;
  singer?: string;
  tjNumber?: number;
}

export interface Favorite {
  songId?: number;
  song?: Song;
  count?: number;
  createDate?: string;
  updateDate?: string;
}
