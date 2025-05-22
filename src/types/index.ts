export interface Spice {
  id: number;
  name: string;
  color: string;
  price: string;
  heat: number;
}

export interface Blend {
  id: number;
  name: string;
  description: string;
  spices: number[];
  blends: number[];
}

export interface BlendWithSpices extends Blend {
  allSpices: Spice[];
}
