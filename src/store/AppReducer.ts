// Define the initial state
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
    prioritizedRepos: [
        "iTwin/itwinjs-core",
        "iTwin/coordinate-reference-system-service",
    ],
    error: null,
    isLoading: false,
    filter: null,
    additionalFilter: null,
    stateFilter: "all",
};

// Define action types
export type action = {
    type: actions;
    payload: any;
}

type actions = "SET_NOTIFICATIONS" | "SET_LABEL_FILTERS" | "SET_PRIORITIZED_REPOS" | "SET_ERROR" | "SET_IS_LOADING" | "SET_FILTER" | "SET_ADDITIONAL_FILTER" | "SET_STATE_FILTER";

// Define the reducer
export const reducer = (state: State, action: action) => {
    switch (action.type) {
        case "SET_NOTIFICATIONS":
            return { ...state, notifications: action.payload };
        case "SET_LABEL_FILTERS":
            return { ...state, labelFilters: action.payload };
        case "SET_PRIORITIZED_REPOS":
            return { ...state, prioritizedRepos: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        case "SET_IS_LOADING":
            return { ...state, isLoading: action.payload };
        case "SET_FILTER":
            return { ...state, filter: action.payload };
        case "SET_ADDITIONAL_FILTER":
            return { ...state, additionalFilter: action.payload };
        case "SET_STATE_FILTER":
            return { ...state, stateFilter: action.payload };
        default:
            return state;
    }
};