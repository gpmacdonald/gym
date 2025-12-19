import type { EquipmentType, WeightUnit } from '../types';

/**
 * Calculate the total weight lifted based on equipment type.
 *
 * For barbell: user enters weight per side, total = (weight × 2) + bar weight
 * For dumbbell: user enters weight per dumbbell, total = weight × 2
 * For machine/cable/bodyweight: weight is as entered
 *
 * @param enteredWeight - The weight value entered by the user
 * @param equipmentType - The type of equipment used
 * @param barbellWeight - The weight of the barbell (default 20kg)
 * @returns The total weight lifted
 */
export function calculateTotalWeight(
  enteredWeight: number,
  equipmentType: EquipmentType,
  barbellWeight: number = 20
): number {
  switch (equipmentType) {
    case 'barbell':
      // User enters weight per side, add bar weight
      return enteredWeight * 2 + barbellWeight;
    case 'dumbbell':
      // User enters weight per dumbbell, multiply by 2
      return enteredWeight * 2;
    case 'machine':
    case 'cable':
    case 'bodyweight':
      // Weight is as entered (bodyweight exercises often have no external weight)
      return enteredWeight;
    default:
      return enteredWeight;
  }
}

/**
 * Convert the entered weight back from total weight.
 * Useful for displaying what the user originally entered.
 *
 * @param totalWeight - The total weight lifted
 * @param equipmentType - The type of equipment used
 * @param barbellWeight - The weight of the barbell (default 20kg)
 * @returns The weight value as the user would enter it
 */
export function calculateEnteredWeight(
  totalWeight: number,
  equipmentType: EquipmentType,
  barbellWeight: number = 20
): number {
  switch (equipmentType) {
    case 'barbell':
      return (totalWeight - barbellWeight) / 2;
    case 'dumbbell':
      return totalWeight / 2;
    case 'machine':
    case 'cable':
    case 'bodyweight':
      return totalWeight;
    default:
      return totalWeight;
  }
}

/**
 * Convert weight between units.
 *
 * @param weight - The weight to convert
 * @param from - The source unit
 * @param to - The target unit
 * @returns The converted weight
 */
export function convertWeight(
  weight: number,
  from: WeightUnit,
  to: WeightUnit
): number {
  if (from === to) return weight;

  const KG_TO_LBS = 2.20462;

  if (from === 'kg' && to === 'lbs') {
    return weight * KG_TO_LBS;
  } else {
    return weight / KG_TO_LBS;
  }
}

/**
 * Format weight for display with appropriate precision.
 *
 * @param weight - The weight to format
 * @param unit - The unit to display
 * @returns Formatted weight string with unit
 */
export function formatWeight(weight: number, unit: WeightUnit): string {
  // Round to 1 decimal place for display
  const rounded = Math.round(weight * 10) / 10;
  // Remove unnecessary decimal if it's a whole number
  const formatted = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
  return `${formatted} ${unit}`;
}

/**
 * Get a description of how the weight is entered for a given equipment type.
 *
 * @param equipmentType - The type of equipment
 * @returns A description string for UI display
 */
export function getWeightEntryDescription(equipmentType: EquipmentType): string {
  switch (equipmentType) {
    case 'barbell':
      return 'Weight per side (excluding bar)';
    case 'dumbbell':
      return 'Weight per dumbbell';
    case 'machine':
      return 'Machine weight';
    case 'cable':
      return 'Cable weight';
    case 'bodyweight':
      return 'Additional weight (optional)';
    default:
      return 'Weight';
  }
}
