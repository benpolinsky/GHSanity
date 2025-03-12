import { AppContext, AppDispatchContext } from "@/store/AppContext";
import React, { useContext } from "react";

const DraftFilter = () => {
  const { draftFilter } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const handleCheckboxChange = () => {
    dispatch({ type: "TOGGLE_DRAFT_FILTER", payload: null });
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={draftFilter}
          onChange={handleCheckboxChange}
        />
        Show Drafts
      </label>
    </div>
  );
};

export default DraftFilter;
