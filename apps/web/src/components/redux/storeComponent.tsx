import type React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "./store";
import { updateDeviceType } from "./Slices/DeviceType";

export interface TsymbolTrade {
  e: string;
  E: number;
  s: string;
  t: number;
  p: string;
  q: string;
  b: number;
  a: number;
  T: number;
  m: boolean;
  M: boolean;
}

// export interface IsymbolLiveContextComponentProps extends PropsWithChildren {}

const StoreComponent: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // Dispatch action based on window size
      if (width < 640) {
        dispatch(updateDeviceType("sm"));
      } else if (width >= 640 && width < 768) {
        dispatch(updateDeviceType("md"));
      } else if (width >= 768 && width < 1024) {
        dispatch(updateDeviceType("lg"));
      } else if (width >= 1024 && width < 1280) {
        dispatch(updateDeviceType("xl"));
      } else {
        dispatch(updateDeviceType("2xl"));
      }
    };

    // Set the initial device type
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  return null;
};
export default StoreComponent;
