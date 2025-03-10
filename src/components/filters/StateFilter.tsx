import { AppContext, AppDispatchContext } from "@/store/AppContext";
import { useContext } from "react";

export const StateFilter = () => {
    const { stateFilter } = useContext(AppContext);
    const dispatch = useContext(AppDispatchContext);
    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: "SET_STATE_FILTER", payload: event.target.value }); // Call dispatch
    };

    return <div>
        <select id="stateFilter" value={stateFilter} onChange={handleStateChange}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
        </select>
    </div>
} 
