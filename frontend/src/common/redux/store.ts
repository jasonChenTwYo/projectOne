import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/common/redux/action";
export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
