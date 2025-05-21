export interface Spice {
  /** Unique identifier for the spice */
  id: number;
  /** Name of the spice */
  name: string;
  /** Hex color code without the # prefix */
  color: string;
  /** Price level represented as number of $ symbols */
  price: string;
  /** Heat level from 0-5 */
  heat: number;
}

export interface Blend {
  /** Unique identifier for the blend */
  id: number;
  /** Name of the blend */
  name: string;
  /** Description of the blend */
  description: string;
  /** Array of spice IDs included in this blend */
  spices: number[];
  /** Array of blend IDs included in this blend */
  blends: number[];
}

export interface BlendWithSpices extends Blend {
  /** Array of all spices included in this blend and its child blends */
  allSpices: Spice[];
}
