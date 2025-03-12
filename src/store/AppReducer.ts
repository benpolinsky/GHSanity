import { Store } from "./AppStorage";
import type { Notification, ReasonFilter } from "@/types";

export type State = {
    notifications: Notification[];
    labelFilters: any[];
    prioritizedRepos: string[];
    error: string | null;
    isLoading: boolean;
    typeFilter: string | null;
    reasonFilter: ReasonFilter
    stateFilter: string;
}

export const initialState: State = {
    notifications: [],
    labelFilters: [],
    prioritizedRepos: [],
    error: null,
    isLoading: false,
    typeFilter: null,
    reasonFilter: null,
    stateFilter: "all",
};

export type action = {
    type: actions;
    payload: any;
}

type actions = "SET_NOTIFICATIONS" | "SET_LABEL_FILTERS" | "SET_PRIORITIZED_REPOS" | "SET_ERROR" | "SET_IS_LOADING" | "SET_FILTER" | "SET_REASON_FILTER" | "SET_STATE_FILTER";

export const makeReducer = (store: Store<Pick<State, "prioritizedRepos" | "labelFilters">>) => (state: State, action: action) => {
    let newState = state;
    let updateSettings = false;
    switch (action.type) {
        case "SET_NOTIFICATIONS":
            newState = { ...state, notifications: action.payload };
            break;
        case "SET_LABEL_FILTERS":
            updateSettings = true;
            newState = { ...state, labelFilters: action.payload };
            break;
        case "SET_PRIORITIZED_REPOS":
            updateSettings = true;
            newState = { ...state, prioritizedRepos: action.payload };
            break;
        case "SET_ERROR":
            newState = { ...state, error: action.payload.message };
            break;
        case "SET_IS_LOADING":
            newState = { ...state, isLoading: action.payload };
            break;
        case "SET_FILTER":
            newState = { ...state, typeFilter: action.payload };
            break;
        case "SET_REASON_FILTER":
            newState = { ...state, reasonFilter: action.payload };
            break;
        case "SET_STATE_FILTER":
            newState = { ...state, stateFilter: action.payload };
            break;
        default:
            break;
    }
    if (updateSettings) {
        const { labelFilters, prioritizedRepos } = newState;
        store.save({ labelFilters, prioritizedRepos })
    }

    return newState;
};