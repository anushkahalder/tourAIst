import React, { useEffect, useState } from 'react';
import axios from 'axios';


const useFetch = (prompt) => {
    const [res, setRes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    

    useEffect(() => {
        if (prompt) {
            console.log("getting data", prompt);
            getData();
        }
    }, [prompt]);

    const getData = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            console.log(prompt);
    
            const res = await axios({
                url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDcl1woSS5T4WQTI6XtQgz4SpmQRqlfdvc",
                method: "POST",
                data: { "contents": [{ "parts": [{ "text": prompt }] }] }
            });
    
            // Log the raw response data
            console.log("Raw response:", res.data);
            let responseText = res.data.candidates[0].content.parts[0].text;
    
            responseText = responseText
            .replace(/```json/g, "") // Remove starting code block markers
            .replace(/```/g, "") // Remove any remaining code block markers
            .trim();

        console.log("Cleaned response text:", responseText);

       

            // Parse the cleaned response
            const parsedData = JSON.parse(responseText);
    
            console.log(parsedData, "formatted response");
    
            setRes(parsedData);
    
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsError(true);
          } finally {
            setIsLoading(false); // Mark loading as false whether successful or failed
          }
    };
    

    return { res, isLoading, isError };
}

export default useFetch
