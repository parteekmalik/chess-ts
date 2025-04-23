export type TDeviceTypeType = "sm" | "md" | "lg" | "xl" | "2xl";

// Define an ordering for the device types
const deviceOrder: Record<TDeviceTypeType, number> = {
  sm: 0,
  md: 1,
  lg: 2,
  xl: 3,
  "2xl": 4,
};

/**
 * Returns true if the target device size is greater than the current device size.
 *
 * @param target - The target device type.
 * @param current - The current device type.
 * @returns boolean indicating if target is greater than current.
 */
export function isGreaterThanDevice(target: TDeviceTypeType, current: TDeviceTypeType): boolean {
  return deviceOrder[target] < deviceOrder[current];
}

/**
 * Returns true if the target device size is smaller than the current device size.
 *
 * @param target - The target device type.
 * @param current - The current device type.
 * @returns boolean indicating if target is smaller than current.
 */
export function issmallerThanDevice(target: TDeviceTypeType, current: TDeviceTypeType): boolean {
  return deviceOrder[target] > deviceOrder[current];
}
