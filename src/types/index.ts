export interface Spice {
  id: string;
  name: string;
  color: string;
  price: number;
  heatLevel: number;
}

export interface Blend {
  id: string;
  name: string;
  spices: Spice[];
  price: number;
  heatLevel: number;
}
