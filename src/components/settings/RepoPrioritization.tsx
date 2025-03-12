"use client";

import React, { useState, useContext } from "react";
import { AppContext, AppDispatchContext } from "@/store/AppContext";
import ComboboxComponent from "../ComboboxContainer";
import TokenContainer from "../TokenContainer";
import "@reach/combobox/styles.css";

const RepoPrioritization = () => {
  const { prioritizedRepos, notifications } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const [inputValue, setInputValue] = useState("");
  const allRepoNames = Array.from(
    new Set(
      notifications.map((notification) => notification.repository.full_name),
    ),
  );

  const handleAddRepo = (repo: string) => {
    if (repo && !prioritizedRepos.includes(repo)) {
      dispatch({
        type: "SET_PRIORITIZED_REPOS",
        payload: [...prioritizedRepos, repo],
      });
      setInputValue("");
    }
  };

  const handleRemoveRepo = (repo: string) => {
    dispatch({
      type: "SET_PRIORITIZED_REPOS",
      payload: prioritizedRepos.filter((r) => r !== repo),
    });
  };

  const handleReorderRepos = (newRepos: string[]) => {
    dispatch({ type: "SET_PRIORITIZED_REPOS", payload: newRepos });
  };

  return (
    <div>
      <p>Prioritize Repositories</p>
      <div>
        <ComboboxComponent
          inputValue={inputValue}
          setInputValue={setInputValue}
          options={allRepoNames}
          onSelect={handleAddRepo} // Fix the onSelect prop
          placeholder="Enter or select a repository"
          buttonText="Add"
        />
      </div>
      <TokenContainer
        tokens={prioritizedRepos}
        onRemove={handleRemoveRepo}
        onReorder={handleReorderRepos}
      />
    </div>
  );
};

export default RepoPrioritization;
