import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/app/common/redux/action";
export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
