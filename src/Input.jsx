import React, { useState } from 'react'
import styled from 'styled-components'

const InputBox = styled.input`
    padding: ${props => props.theme.padding};
    font-size: 16px;
    font-family: ${props => props.theme.font};
    width: 100%;
    background-color: ${props => props.theme.colorPalette.background2};
    color: ${props => props.theme.colorPalette.text};
    ::placeholder {
        color: ${props => props.theme.colorPalette.text};
    }
    text-align: center;
    box-sizing: border-box;
`

export default function Input(props) {
    const [error, setError] = useState('null');
    const [value, setValue] = useState('');

    const handleOnChange = (event) => {
        const { value } = event.target;
        const regexForSingleWord = /^[a-zA-Z]+$/;
        if (!regexForSingleWord.test(value)) {
            setError('Please enter a single word');
        } else {
            setError(null);
            setValue(value);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !error && value) {
            props.onInput(value);
            setValue('');
        }
    }
    
    return (
        <div>
            <InputBox 
                type="text" 
                value={value} 
                onChange={handleOnChange} 
                onKeyDown={handleKeyDown}
                placeholder="Enter a word"
            />
        </div>
    );
}