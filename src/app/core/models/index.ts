export interface Song {
  id?: string;
  title?: string;
  singer?: string;
  tjNumber?: number;
}

export interface Favorite {
  id?: string;
  song?: Song;
  count?: number;
  createDate?: string;
  updateDate?: string;
}
