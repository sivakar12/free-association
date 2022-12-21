import React, { useEffect, useState, useContext } from 'react'
import styled from "styled-components"
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import Sentiment from 'sentiment'

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import Input from "./Input"
import List from "./List"
import useColorScheme from "./useColorScheme"
import * as theme from './theme'
import Results from './Results'
import Config from './Config'
import { AuthProvider, AuthContext } from './firebase'

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.colorPalette.background2};
`

const TopBarButton = styled.div`
  background-color: ${props => props.theme.colorPalette.background2};
  border: none;
  color: ${props => props.theme.colorPalette.text};
  padding: ${props => props.theme.padding};
  cursor: pointer;
`


const Title = styled.h1`
  text-align: center;
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

  const handleLogin = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
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

  const LoginButtonArea = () => {
    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
      return (
        <TopBarButton onClick={handleLogout}>Logout</TopBarButton>
      )
    } else {
      return (
        <TopBarButton onClick={handleLogin}>Login</TopBarButton>
      )
    }
  }

  return (
    <AuthProvider>
      <ThemeProvider theme={themeWithSchemeSelected}>
        <GlobalStyle/>
        <Container id="container">
          <TopBar>
            <TopBarButton>History</TopBarButton>
            <Title>Free Association</Title>
            <LoginButtonArea/>
          </TopBar>
          { state === "NOT_STARTED" && <Config/> }
          { state === "IN_PROGRESS" && <List list={list}/> }
          { state === "COMPLETED" && <Results results={results}/> }
          <Input state={state} onInput={handleInput}/>
        </Container>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
