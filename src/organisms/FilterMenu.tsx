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
    const enabled = enabledFilters.includes(filter.name);
    if (enabled) {
      dispatch(disable(filter.name));
    } else {
      dispatch(enable(filter.name));
    }
  }

  return (
    <PillMenu>
      {filters.map((filter, index) => (
        <Pill
          key={index}
          selected={enabledFilters.includes(filter.name)}
          onClick={() => onPillClick(filter)}
        >
          {filter.name}
        </Pill>
      ))}
    </PillMenu>
  );
}
