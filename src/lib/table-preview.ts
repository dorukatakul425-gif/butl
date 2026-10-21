// Original TableView virtual coordinates; shared by rendering and bottle targeting.
export const TABLE_SIZE = 375;
export const ASSET_SCALE = (375 / 704) * 1.17;
export const SEATS: [number, number][] = [
  [41.5, -140.5], [123.5, -120.5], [138.5, -38.5], [138.5, 42.5], [123.5, 124.5], [41.5, 143.5],
  [-40.5, 143.5], [-122.5, 124.5], [-137.5, 42.5], [-137.5, -38.5], [-122.5, -120.5], [-40.5, -140.5],
];
export const BOTS = [
  { name: 'Aylin', g: 'women', id: 12 }, { name: 'Murad', g: 'men', id: 32 },
  { name: 'Leyla', g: 'women', id: 44 }, { name: 'Kenan', g: 'men', id: 15 },
  { name: 'Nigar', g: 'women', id: 68 }, { name: 'Elvin', g: 'men', id: 52 },
  { name: 'Səbinə', g: 'women', id: 21 }, { name: 'Orxan', g: 'men', id: 75 },
  { name: 'Aysel', g: 'women', id: 90 }, { name: 'Rauf', g: 'men', id: 8 },
  { name: 'Günay', g: 'women', id: 33 }, { name: 'Tural', g: 'men', id: 61 },
];
export const seatAngle = (index: number) => {
  const seat = SEATS[index];
  return seat ? Math.atan2(seat[0], -seat[1]) * 180 / Math.PI : 0;
};
export type ChatMessage = { id: number; name: string; text: string; gender?: string; system?: boolean };
export const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 1, name: '', text: 'Masa 1 · Oyun başladı', system: true },
  { id: 2, name: 'Aylin', gender: 'women', text: 'Herkese merhaba! 😊' },
  { id: 3, name: 'Murad', gender: 'men', text: 'Hoş geldiniz, şişe kimde? 😄' },
  { id: 4, name: 'Leyla', gender: 'women', text: 'Bakalım kime gelecek 🍀' },
];