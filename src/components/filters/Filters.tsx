
import NotificationTypeFilter from "./NotificationTypeFilter"
import ReasonFilters from "./ReasonFilters"
import { StateFilter } from "./StateFilter"
import styles from '../App.module.css'

export const Filters = () => {
    return <div className={styles.filtersContainer}>
        <NotificationTypeFilter />
        <ReasonFilters />
        <StateFilter />
    </div>
}