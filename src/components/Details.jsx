import React, { useEffect, useState } from 'react';
import '../components/details.css';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useDispatch, useSelector } from 'react-redux';
import { addDayWisePlan } from '../slicer/TourSlice';

const Details = () => {
  const { id: tripId } = useParams();
  const dispatch = useDispatch();

  const trip = useSelector(state => state.allTrips.data.find(trip => trip.tripId === tripId));
  const dayWisePlanFromState = trip ? trip.dayWisePlan : ""; // Assuming dayWisePlans is an object keyed by tripId
  const tripRequests = useSelector(state => state.allTrips.tripRequests);

  const [prompt, setPrompt] = useState('');
  console.log(trip, "from sTATE")
  useEffect(() => {
    if (trip && tripRequests) {
      const generatedPrompt = `Generate a day-wise trip plan for ${trip.tripName} in ${tripRequests.country}, ${tripRequests.state} for ${tripRequests.days} days.
      For each day, provide:
      1. The day number.
      2. A list of 3 activities to do that day.
      Return the response in the following JSON format:
      [
        {
          "day": 1,
          "activities": [
            "Activity 1 for day 1",
            "Activity 2 for day 1",
            "Activity 3 for day 1"
          ]
        },
        {
          "day": 2,
          "activities": [
            "Activity 1 for day 2",
            "Activity 2 for day 2",
            "Activity 3 for day 2"
          ]
        },
        {
          "day": 3,
          "activities": [
            "Activity 1 for day 3",
            "Activity 2 for day 3",
            "Activity 3 for day 3"
          ]
        }
      ]`;

      setPrompt(generatedPrompt);
    }
  }, [trip, tripRequests]); // Runs when trip or tripRequests change

  // Call useFetch always, even if prompt is empty
  const { res: dayWisePlan, isLoading, isError } = useFetch(prompt, !dayWisePlanFromState);

  useEffect(() => {
    // Dispatch only if dayWisePlan exists and it is not already stored in the state
    if (dayWisePlan && dayWisePlan.length > 0 && !dayWisePlanFromState?.length) {
      dispatch(addDayWisePlan({ tripId, dayWisePlan }));
    }
  }, [dayWisePlan, dayWisePlanFromState, tripId, dispatch]);

  trip.tripResturants.forEach(restaurant => {
    console.log(restaurant.name, restaurant.description);
  });
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

  return (
    <div className="content">
      <div className="tripHeader">
        <div className="row">
          <div className="col-9">
            <div className='dayTrips'>
              <h3>Day-wise Trip Plan for {trip?.tripName}</h3>
              {isLoading ? (
                <p>Loading day-wise trip plan...</p>
              ) : isError ? (
                <p>Error generating trip plan.</p>
              ) :  Array.isArray(dayWisePlanFromState) && dayWisePlanFromState.length > 0 ? (
                dayWisePlanFromState.map((plan, index) => (
                  <div className="day-card"   style={{ borderLeft: `4px solid ${getRandomColor()}` }} key={index}>
                    <h4>Day {plan.day}</h4>
                    <ul>
                      {plan.activities.map((activity, idx) => (
                        <li key={idx}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>No plan available for this trip.</p>
              )}
            </div>
          </div>
          {/* Render Restaurants */}
          <div className="col-3">
            <h3>Nearby Restaurants</h3>
            {trip.tripResturants && (
              <ul className="restaurant-list">
                {trip.tripResturants.map((restaurant, index) => (
                  <li key={index} className="restaurant-item">
                    <div className="restaurant-name">
                      <strong>{restaurant.name}</strong>
                    </div>
                    <div className="restaurant-description">
                      {restaurant.description}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>


        </div>
      </div>
    </div>

  );
}

export default Details;
