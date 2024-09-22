import { configureStore } from '@reduxjs/toolkit'
import tourReducer from '../slicer/TourSlice'
import { saveStateToLocalStorage, loadStateFromLocalStorage } from '../utils/localStorage'
const persistedState = loadStateFromLocalStorage();

const store = configureStore({
  reducer: {
    allTrips: tourReducer,
  },
  preloadedState: persistedState, // Load initial state from local storage
});

// Subscribe to store updates to save state to local storage
store.subscribe(() => {
  saveStateToLocalStorage(store.getState());
});

export default store;