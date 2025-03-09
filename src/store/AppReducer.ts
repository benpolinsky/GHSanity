import { Store } from "./AppStorage";

export type State = {
    notifications: any[];
    labelFilters: any[];
    prioritizedRepos: string[];
    error: string | null;
    isLoading: boolean;
    filter: string | null;
    additionalFilter: string | null;
    stateFilter: string;
}

export const initialState: State = {
    notifications: [],
    labelFilters: [],
    prioritizedRepos: [],
    error: null,
    isLoading: false,
    filter: null,
    additionalFilter: null,
    stateFilter: "all",
};

export type action = {
    type: actions;
    payload: any;
}

type actions = "SET_NOTIFICATIONS" | "SET_LABEL_FILTERS" | "SET_PRIORITIZED_REPOS" | "SET_ERROR" | "SET_IS_LOADING" | "SET_FILTER" | "SET_ADDITIONAL_FILTER" | "SET_STATE_FILTER";

export const makeReducer = (store: Store<Pick<State, "prioritizedRepos" | "labelFilters">>) => (state: State, action: action) => {
    let newState = state;
    switch (action.type) {
        case "SET_NOTIFICATIONS":
            newState = { ...state, notifications: action.payload };
            break;
        case "SET_LABEL_FILTERS":
            newState = { ...state, labelFilters: action.payload };
            break;
        case "SET_PRIORITIZED_REPOS":
            newState = { ...state, prioritizedRepos: action.payload };
            break;
        case "SET_ERROR":
            newState = { ...state, error: action.payload.message };
            break;
        case "SET_IS_LOADING":
            newState = { ...state, isLoading: action.payload };
            break;
        case "SET_FILTER":
            newState = { ...state, filter: action.payload };
            break;
        case "SET_ADDITIONAL_FILTER":
            newState = { ...state, additionalFilter: action.payload };
            break;
        case "SET_STATE_FILTER":
            newState = { ...state, stateFilter: action.payload };
            break;
        default:
            break;
    }

    const { labelFilters, prioritizedRepos } = newState;

    store.save({ labelFilters, prioritizedRepos })
    return newState;
};