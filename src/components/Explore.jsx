import React, { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import ResponsePage from './ResponsePage';
import '../components/Explore.css'
import useFetch from '../hooks/useFetch';

const Explore = () => {
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [days, setDays] = useState('');
    const [statePrompt, setStatePrompt] = useState('');
    const [allstates, setAllstates] = useState([]);
    const debouncedCountry = useDebounce(country, 500);
    const {res:stateArray, isLoading, isError } = useFetch(statePrompt);
    const [isStateSelected, setIsStateSelected] = useState(false);
    const [filteredStates, setFilteredStates] = useState([]);
    const [submittedData, setSubmittedData] = useState({
        country: '',
        state: '',
        days: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (debouncedCountry) {
            setStatePrompt(`Provide a list of all states in ${debouncedCountry} in an array format and in response 
                res.data.candidates[0].content.parts[0].text should contain simply an array of states, no other extra words, which would be easier to extract that array, no conslusion statement and nothing`);
        }
    }, [debouncedCountry]);

    useEffect(() => {
        console.log(stateArray);
        setAllstates(stateArray)
    }, [stateArray]);


    useEffect(() => {
        if (state.length > 0 && !isStateSelected) {
            const filtered = allstates.filter(s =>
                s.toLowerCase().includes(state.toLowerCase())
            );
            setFilteredStates(filtered);

        } else {
            setFilteredStates([]);

        }
    }, [state, allstates]);

    const handleStateSelection = (selectedState) => {
        setState(selectedState);
        setFilteredStates([]);
        setIsStateSelected(true)

    };

    const handleSubmit = (e) => {
        e.preventDefault();
         console.log("Submit btn is clicked")
        // Basic validation
        const newErrors = {};
        if (!country) newErrors.country = 'Country is required';
        if (!state) newErrors.state = 'State is required';
        if (!days) newErrors.days = 'Days is required';
        if (isNaN(days)) newErrors.days = 'Days must be a number';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Clear errors and proceed with form submission
        setErrors({});
        console.log({ country, state, days });


        setSubmittedData({ country, state, days });
        // Clear form after submission
        setCountry('');
        setState('');
        setDays('');
    };

    const handleStateChange = (e) => {
        setState(e.target.value);
        setIsStateSelected(false); // Reset the flag whenever typing happens (including backspaces)
    };




    return (
        <div className='exploreDiv'>

            <div className="image-container">
                <img className='image' src="https://png.pngtree.com/background/20230513/original/pngtree-autumn-landscape-outdoor-travel-background-picture-image_2511426.jpg" alt="TourAIst" />
            </div>
            <div className="form-container">
            <form onSubmit={handleSubmit}>
                    <div className="row allForms">
                        <div className="col-3">
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder='Enter country'
                            />
                            {errors.country && <p className="error-text">{errors.country}</p>}
                        </div>
                        <div className="col-3">
                            <input
                                type="text"
                                value={state}
                                onChange={handleStateChange}
                                placeholder={country?'Enter state':'Enter country to enter State'}
                                disabled={!country}  
                            />
                            {errors.state && <p className="error-text">{errors.state}</p>}
                            
                            <ul className="suggestions-list">
                                {filteredStates && filteredStates.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleStateSelection(suggestion)}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-3">
                            <input
                                type="text"
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                placeholder='Enter days'
                            />
                            {errors.days && <p className="error-text">{errors.days}</p>}
                        </div>
                        <div className="col-3">
                            <button type="submit">Add Details</button>
                        </div>
                    </div>
                </form>
            </div>
             
            <ResponsePage
                country={submittedData.country}
                state={submittedData.state}
                days={submittedData.days} />

        </div>
    );
}

export default Explore;
