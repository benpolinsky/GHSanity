
import NotificationTypeFilter from "./NotificationTypeFilter"
import ReasonFilters from "./ReasonFilters"
import { StateFilter } from "./StateFilter"

export const Filters = () => {
    return <>
        <NotificationTypeFilter />
        <ReasonFilters />
        <StateFilter />
    </>
}