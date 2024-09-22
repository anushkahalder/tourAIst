import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from '../hooks/useFetch'; // Custom hook for fetching data
import { fetchTripPending, fetchTripFulfilled, fetchTripError, addTripRequests } from '../slicer/TourSlice';
import '../components/res.css';
import Pagination from '../utils/Pagination';
import { useNavigate } from 'react-router-dom';



const ResponsePage = ({ country, state, days }) => {
  const navigate = useNavigate();



  const [prompt, setPrompt] = useState('')
  const { tripRequests, data, isDataLoading, isDataError } = useSelector((state) => state.allTrips);
  const [selectedRestaurants, setSelectedRestaurants] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;  // Show 4 items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  console.log(data, "from state")


  useEffect(() => {
    if (country && state && days) {
      const prompt1 = `
      Suggest 10 popular and unpopular places in the state of ${state}, ${country} to visit.
      For each place, provide:
      1. A unique tripId (use a short identifier - mix of capitaal letters and numbers).
      2. A trip Name , that is the place name
      3. A short tripDesc (2-3 sentences describing the place).
      4. tripResturants (list of 5 nearby restaurants with short descriptions).
      Return the response in the following JSON format:
      [
        {
          "tripId": "09A2",
          "tripName: "Name_of_place",
          "tripDesc": "Short description of the place.",
          "tripResturants": [
            {
              "name": "Restaurant 1",
              "description": "Short description of restaurant 1.",
            },
            {
              "name": "Restaurant 2",
              "description": "Short description of restaurant 2.",
            },
              {
              "name": "Restaurant 3",
              "description": "Short description of restaurant 2.",
            },
              {
              "name": "Restaurant 4",
              "description": "Short description of restaurant 2.",
            },
              {
              "name": "Restaurant 5",
              "description": "Short description of restaurant 2.",
            }
          ]
        },
 
      ]
`;
      setPrompt(prompt1);
    }

    setSelectedRestaurants("");
    setCurrentPage(1);

  }, [country, state, days])

  const dispatch = useDispatch();


  const { res: fetchedData, isLoading, isError } = useFetch(prompt); // Destructure data and status

  useEffect(() => {

    console.log(fetchedData, "data from hook")
    if (country && state && days) {
      if (isLoading) {
        dispatch(fetchTripPending()); // Set loading to true
      }

      if (isError) {
        dispatch(fetchTripError()); // Handle error state
      }

      if (fetchedData && !isLoading && !isError) {
        dispatch(fetchTripFulfilled(fetchedData)); // Set response data in Redux store
      }
      dispatch(addTripRequests({ country, state, days }))
    }
  }, [country, state, days, isLoading, isError, fetchedData, dispatch]);

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
    setSelectedRestaurants(trip.tripResturants);
  };

  const handleNagivation = (trip) => {
    navigate(`/details/${trip.tripId}`);
  }

  return (
    <div className="response-container">
      <div className="row resRow">
        <div className="col-8 resCol">
          {/* <p>Response for {tripRequests?.country}, {tripRequests.state},{tripRequests.days}  days:</p> */}
        

          {isDataLoading ? (
            <p className="loading-text">Loading trip plan...</p>
          ) : isDataError ? (
            <p className="error-text">Error fetching trip plan. Please try again.</p>
          ) : data.length > 0 ? (
            <div>
              <p><em><b>
                Trip plan for {tripRequests?.days} days in {tripRequests?.state}, {tripRequests?.country?.charAt(0).toUpperCase() + tripRequests?.country?.slice(1)}:
              </b></em></p>
              {data.slice(startIndex, endIndex).map((trip, index) => (
                <div
                  className={`row trip-card ${selectedTrip && selectedTrip.tripName === trip.tripName ? "selected" : ""}`}
                  key={index}
                  onClick={() => handleTripClick(trip)}
                  title="Click to view restaurants"
                >
                  <div className="col-10 trip-header">
                    <h4>{trip.tripName}</h4>
                  </div>
                  <div className="tooltip">
                    Click to view restaurants
                  </div>
                  <div className="col-2 show-more-container">
                    <button className="show-more-btn" onClick={() => handleNagivation(trip)}>View Trip Plan</button>
                  </div>
                  <hr className="header-border" />
                  <p>{trip.tripDesc}</p>
                </div>
              ))}

              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={data.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          ) : (
            <p>Please enter details to generate a trip plan.</p>
          )}
        </div>
        <div className="col-4 resCol">

          {selectedRestaurants === "" ? (
            <div className="msg">
              <div className='circle'>
                +
              </div>
              <p>Click on a trip plan to see nearby restaurants</p>
            </div>

          ) : (

            <div className={`restaurants ${selectedRestaurants ? "active" : ""}`}>

              {selectedRestaurants ? (
                <div>
                  <h4>Nearby Restaurants</h4>
                  <ul className="restaurant-list">
                    {selectedRestaurants.map((restaurant, index) => (
                      <li key={index} className="restaurant-item">
                        <p className="restaurant-name"><strong>{restaurant.name}</strong></p>
                        <p className="restaurant-description">{restaurant.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Click on a trip plan to see nearby restaurants.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default ResponsePage;
