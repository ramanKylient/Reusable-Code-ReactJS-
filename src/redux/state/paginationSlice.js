import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  usersPagination: { page: 1, pageSize: 10, totalItems: 0 },
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPage(state, action) {
      state.usersPagination.page = action.payload;
    },
    setPageSize(state, action) {
      state.usersPagination.pageSize = action.payload;
    },
    setTotalItems(state, action) {
      state.usersPagination.totalItems = action.payload;
    },
  },
});

export const {
  setPage,
  setPageSize,
  setTotalItems,
} = paginationSlice.actions;
export default paginationSlice.reducer;
