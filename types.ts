export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface FontOption {
  name: string;
  family: string;
}

export const FONTS: FontOption[] = [
  { name: 'Standaard (Sans-Serif)', family: 'sans-serif' },
  { name: 'Roboto', family: "'Roboto', sans-serif" },
  { name: 'Open Sans', family: "'Open Sans', sans-serif" },
  { name: 'Lato', family: "'Lato', sans-serif" },
  { name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { name: 'Playfair Display', family: "'Playfair Display', serif" },
  { name: 'Merriweather', family: "'Merriweather', serif" },
  { name: 'Oswald', family: "'Oswald', sans-serif" },
  { name: 'Inconsolata', family: "'Inconsolata', monospace" },
  { name: 'Patrick Hand', family: "'Patrick Hand', cursive" },
  { name: 'Amatic SC', family: "'Amatic SC', cursive" },
];