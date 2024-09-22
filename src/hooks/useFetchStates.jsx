import React, { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchStates = (prompt) => {
    const [allstates, setAllstates] = useState([]);

    useEffect(() => {
        if (prompt) {
            console.log("getting data", prompt);
            getData();
        }
    }, [prompt]);

    const getData = async () => {
        try {
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
    
            setAllstates(parsedData);
    
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

    return allstates;
}

export default useFetchStates;
