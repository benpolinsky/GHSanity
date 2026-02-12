"use client";

import TypeSegments from "./TypeSegments";
import ReasonPills from "./ReasonPills";
import StateControls from "./StateControls";
import styles from "./FilterBar.module.css";

const FilterBar: React.FC = () => {
  return (
    <div className={styles.filterBar}>
      <TypeSegments />
      <div className={styles.divider} />
      <ReasonPills />
      <div className={styles.divider} />
      <StateControls />
    </div>
  );
};

export default FilterBar;
