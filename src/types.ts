export interface Spice {
  color: string;
  heat: number;
  id: number;
  name: string;
  price: string;
}

export interface Blend {
  blends: number[];
  description: string;
  id: number;
  name: string;
  spices: number[];
}

export interface BlendWithSpices extends Blend {
  spiceDetails: Spice[];
  childBlends: Omit<BlendWithSpices, 'spiceDetails'>[];
  allSpices: Spice[];
}
