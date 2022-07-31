import { Pill } from '~/atoms/pills/Pill.js';
import { PillMenu } from '~/atoms/pills/PillMenu.js';
import { Filter } from '~/model/Filter.js';
import { useGetFiltersQuery } from '~/redux/apiSlice.js';
import { disable, enable } from '~/redux/filterSlice.js';
import { useAppDispatch, useAppSelector } from '~/redux/store.js';

export function FilterMenu() {
  const dispatch = useAppDispatch();
  const enabledFilters = useAppSelector((state) => state.filter.enabled);

  const { data: filters = [] } = useGetFiltersQuery();

  function onPillClick(filter: Filter) {
    const enabled = enabledFilters.includes(filter.id);
    if (enabled) {
      dispatch(disable(filter.id));
    } else {
      dispatch(enable(filter.id));
    }
  }

  return (
    <PillMenu>
      {filters.map((filter, index) => (
        <Pill
          key={index}
          selected={enabledFilters.includes(filter.id)}
          onClick={() => onPillClick(filter)}
        >
          {filter.name}
        </Pill>
      ))}
    </PillMenu>
  );
}
