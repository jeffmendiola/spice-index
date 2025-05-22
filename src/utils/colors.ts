import type { Blend, Spice } from '../types';

/**
 * Gets the colors of all spices in a blend, including those from nested blends.
 * If no colors are found, returns a default indigo color.
 */
export const getBlendColors = (
  blend: Blend,
  spices: Spice[],
  allBlends: Blend[],
): string[] => {
  // Get colors from direct spices
  const spiceColors = blend.spices
    .map((spiceId) => {
      const spice = spices.find((s) => s.id === spiceId);
      return spice?.color ?? null;
    })
    .filter((color): color is string => color !== null);

  if (spiceColors.length > 0) return spiceColors;

  // Get colors from nested blends
  const blendColors = blend.blends
    .map((blendId) => {
      const childBlend = allBlends.find((b) => b.id === blendId);
      if (!childBlend) return null;
      return getBlendColors(childBlend, spices, allBlends);
    })
    .filter((colors): colors is string[] => colors !== null)
    .flat();

  if (blendColors.length > 0) return blendColors;

  return ['7e7ac0']; // Default indigo color
};

/**
 * Formats colors for use in CSS gradients
 */
export const formatColorsForGradient = (colors: string[]): string => {
  return colors.map((color) => `#${color}`).join(', ');
};
