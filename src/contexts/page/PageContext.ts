import { createContext } from "react";

export interface IPageContextState {
    uid: string | null;
}

export const defaultPageContextState: IPageContextState = {
    uid: sessionStorage.getItem("uid"),
};
export type TPageContextActions = "update_uid";
export type TPageContextPayload =  string;

export interface IPageContextActions {
    type: TPageContextActions;
    payload: TPageContextPayload;
}
export const PageReducer = (state: IPageContextState, action: IPageContextActions) => {
    console.log("Update State - Action: " + action.type + " - Payload: ", action.payload);

    switch (action.type) {
        case "update_uid":
            return { ...state, uid: action.payload as string };
        default:
            return state;
    }
};
export interface IPageContextProps {
    PageState: IPageContextState;
    PageDispatch: React.Dispatch<IPageContextActions>;
}

const PageContext = createContext<IPageContextProps>({
    PageState: defaultPageContextState,
    PageDispatch: () => {},
});

export const PageContextConsumer = PageContext.Consumer;
export const PageContextProvider = PageContext.Provider;

export default PageContext;
