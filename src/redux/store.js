import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import globalLoadingSlice from "./features/globalLoadingSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    globalLoading: globalLoadingSlice,
  },
});

export default store;
