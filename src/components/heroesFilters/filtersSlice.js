import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";

const filtersAdapter = createEntityAdapter({
  selectId: (filter) => filter.name,
});

const initialState = filtersAdapter.getInitialState({
  filtersLoadingStatus: "idle",
  activeFilter: "all",
});

// const initialState = {
//   filters: [],
//   filtersLoadingStatus: "idle",
//   activeFilter: "all",
// };

export const fetchFilter = createAsyncThunk(
  "filters/fetchFilter",
  async (request) => {
    return await request("http://localhost:3001/filters");
  },
);

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    activeFilterChange: (state, action) => {
      state.activeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilter.pending, (state) => {
        state.filtersLoadingStatus = "loading";
      })
      .addCase(fetchFilter.fulfilled, (state, action) => {
        state.filtersLoadingStatus = "idle";
        filtersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchFilter.rejected, (state) => {
        state.filtersLoadingStatus = "error";
      });
  },
});

const { actions, reducer } = filtersSlice;

export const { selectAll: selectAllFilters } = filtersAdapter.getSelectors(
  (state) => state.filters,
);

export default reducer;

export const {
  filtersFetching,
  filtersFetched,
  filtersFetchingError,
  activeFilterChange,
} = actions;
