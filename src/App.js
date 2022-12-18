import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import Sentiment from 'sentiment'

import Input from "./Input"
import List from "./List"
import useColorScheme from "./useColorScheme"
import * as theme from './theme'
import Results from './Results'
import Config from './Config'

const Title = styled.h1`
  text-align: center;
  padding: ${props => props.theme.padding};
  font-size: ${props => props.theme.fontSizes[0]};
  background-color: ${props => props.theme.colorPalette.background2};
  color: ${props => props.theme.colorPalette.text};
`

const Container = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  height: 100%;
  font-family: ${props => props.theme.font};
  background-color: ${props => props.theme.colorPalette.background};
  color: ${props => props.theme.colorPalette.text};
`


const states = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
const timeInSeconds = 30;

function App() {
  const [state, setState] = useState(states[0]);
  const [list, setList] = useState([]);
  const [results, setResults] = useState({});
  
  const colorScheme = useColorScheme();
  
  const themeWithSchemeSelected = {
    ...theme,
    colorPalette: colorScheme === 'dark' ? theme.colorPaletteDark : theme.colorPalette,
  }
  
  const GlobalStyle = createGlobalStyle`
  html, body {
    background-color: ${props => props.theme.colorPalette.background};
    padding: 0;
    margin: 0;
  }
  `

  const handleInput = (value) => {
    if (state === "NOT_STARTED") {
      setState("IN_PROGRESS");
    }
    if (state === "IN_PROGRESS" || state === "NOT_STARTED") {
      setList([...list, value]);
    }
  }

  useEffect(() => {
    function setElementHeight() {
      const keyboardHeight = window.innerHeight - document.documentElement.clientHeight;
      const element = document.getElementById('container');
      element.style.height = `calc(100vh - ${keyboardHeight}px)`;
    }
    setElementHeight();
    window.addEventListener('resize', setElementHeight);
  }, [])
  useEffect(() => {
    if (state === "IN_PROGRESS") {
      setTimeout(() => {
        setState("COMPLETED");
      }, timeInSeconds * 1000)
    }
    if (state === "COMPLETED") {
      const sentiment = new Sentiment();
      const results = sentiment.analyze(list.join(' '));
      setResults(results)
    }
  // eslint-disable-next-line
  }, [state])

  return (
    <ThemeProvider theme={themeWithSchemeSelected}>
      <GlobalStyle/>
      <Container id="container">
        <Title>Free Association</Title>
        { state === "NOT_STARTED" && <Config/> }
        { state === "IN_PROGRESS" && <List list={list}/> }
        { state === "COMPLETED" && <Results results={results}/> }
        <Input state={state} onInput={handleInput}/>
      </Container>
    </ThemeProvider>
  );
}

export default App;
