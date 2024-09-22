import { createSlice } from '@reduxjs/toolkit';

const TourSlice = createSlice({
  name: 'allTrips',
  initialState: {
    tripRequests :null,
    isDataLoading: false,
    data: [],
    isDataError: false,
  },
  reducers: {
    addTripRequests:(state, action) => {
      state.tripRequests = action.payload
    },
    fetchTripPending: (state) => {
      state.isDataLoading = true;
      state.isDataError = false;
    },
    fetchTripFulfilled: (state, action) => {
      state.isDataLoading = false;
      state.data = action.payload;
      state.isDataError = false;
    },
    fetchTripError: (state) => {
      state.isDataLoading = false;
      state.isDataError = true;
    },
    addDayWisePlan: (state, action) => {
      const { tripId, dayWisePlan } = action.payload;
      const tripIndex = state.data.findIndex(trip => trip.tripId === tripId);
      if (tripIndex !== -1) {
        state.data[tripIndex].dayWisePlan = dayWisePlan; // Add the day-wise plan to the specific trip
      }
    },
  },
});

export const { fetchTripPending, fetchTripFulfilled, fetchTripError ,addTripRequests,addDayWisePlan} = TourSlice.actions;

export default TourSlice.reducer;
