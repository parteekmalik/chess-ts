import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// Define the type for the device type
export type TDeviceTypeType = "sm" | "md" | "lg" | "xl" | "2xl";

// Define the initial state with the type explicitly
const initialState: TDeviceTypeType = "lg" as TDeviceTypeType;

// Create the slice
const DeviceTypeSlice = createSlice({
  name: "DeviceTypeType",
  initialState,
  reducers: {
    // The reducer that updates the device type
    updateDeviceType: (state, action: PayloadAction<TDeviceTypeType>) => {
      // Return the new device type from the payload
      return action.payload;
    },
  },
});

// Export the actions
export const { updateDeviceType } = DeviceTypeSlice.actions;

// Export the reducer
export default DeviceTypeSlice.reducer;
