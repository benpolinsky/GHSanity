import NotificationTypeFilter from "./NotificationTypeFilter";
import ReasonFilters from "./ReasonFilters";
import { StateFilter } from "./StateFilter";
import styles from "../App.module.css";
import DraftFilter from "./DraftFilter";

export const Filters = () => {
  return (
    <div className={styles.filtersContainer}>
      <NotificationTypeFilter />
      <ReasonFilters />
      <StateFilter />
      <DraftFilter />
    </div>
  );
};
