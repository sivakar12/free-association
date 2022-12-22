import React, { useContext } from 'react'
import styled from "styled-components"
import { ThemeProvider, createGlobalStyle } from 'styled-components'

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';

import './style.css';
import useColorScheme from "./useColorScheme";
import * as theme from './theme';
import { AuthProvider, AuthContext } from './firebase';
import History from './History';
import Session from './Session';

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

const GlobalStyle = createGlobalStyle`
  html, body {
    background-color: ${props => props.theme.colorPalette.background};
    padding: 0;
    margin: 0;
    font-family: ${props => props.theme.font};
  }
`

function App() {
  

  const colorScheme = useColorScheme();
  
  const themeWithSchemeSelected = {
    ...theme,
    colorPalette: colorScheme === 'dark' ? theme.colorPaletteDark : theme.colorPalette,
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
    <BrowserRouter>
    <AuthProvider>
      <ThemeProvider theme={themeWithSchemeSelected}>
        <GlobalStyle/>
          <TopBar>
            <Link to="/history">
              <TopBarButton>History</TopBarButton>
            </Link>
            <Link to="/">
              <Title>Free Association</Title>
            </Link>
            <LoginButtonArea/>
          </TopBar>
          <Routes>
            <Route path="/" element={<Session/>}/>
            <Route path="/history" element={<History/>} />
          </Routes>
      </ThemeProvider>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
