import React, { useState } from 'react';
import axios from 'axios';

const JsonInputForm = () => {
    const [inputData, setInputData] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        try {
            // Attempt to parse the JSON input
            const parsedInput = JSON.parse(inputData);

            // Ensure that the parsed input contains a "data" array
            if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
                throw new Error('JSON must contain a "data" array.');
            }

            // Send the parsed data to the backend
            const res = await axios.post('http://localhost:8080/bfhl', { data: parsedInput.data });
            setResponse(res.data);  // Update response state with the backend response
        } catch (error) {
            console.error('Error:', error.message);
            setResponse(null); // Clear previous response on error
            setError('Invalid JSON input or incorrect format. Please make sure your input is a valid JSON with a "data" array.');
        }
    };

    return (
        <div>
            <h1>21BCE1033</h1> 
            <form onSubmit={handleSubmit}>
                <textarea
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    placeholder='Enter JSON input here...'
                    rows={5}
                    style={{ width: '100%' }}
                />
                <button type="submit">Submit</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {response && (
                <div>
                    <h3>Response:</h3>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                    <MultiSelect response={response} />
                </div>
            )}
        </div>
    );
};

const MultiSelect = ({ response }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const options = [
        { label: 'Alphabets', value: 'alphabets' },
        { label: 'Numbers', value: 'numbers' },
        { label: 'Highest Lowercase Alphabet', value: 'highest_lowercase' }
    ];

    const handleSelect = (e) => {
        const value = e.target.value;
        setSelectedOptions(prev =>
            prev.includes(value) ? prev.filter(opt => opt !== value) : [...prev, value]
        );
    };

    const filteredResponse = () => {
        const filtered = {};
        selectedOptions.forEach(option => {
            filtered[option] = response[option];
        });
        return filtered;
    };

    return (
        <div>
            <h4>Multi Filter</h4>
            {options.map(opt => (
                <div key={opt.value}>
                    <input
                        type="checkbox"
                        id={opt.value}
                        value={opt.value}
                        onChange={handleSelect}
                    />
                    <label htmlFor={opt.value}>{opt.label}</label>
                </div>
            ))}
            <h4>Filtered Response</h4>
            <pre>{JSON.stringify(filteredResponse(), null, 2)}</pre>
        </div>
    );
};

export default JsonInputForm;
