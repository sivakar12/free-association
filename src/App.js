import React, { useState } from 'react'
import styled from "styled-components"
import { ThemeProvider, createGlobalStyle } from 'styled-components'

import Input from "./Input"
import List from "./List"
import useColorScheme from "./useColorScheme"
import * as theme from './theme'

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
  justify-content: stretch;
  height: 96vh;
  font-family: ${props => props.theme.font};
  background-color: ${props => props.theme.colorPalette.background};
  color: ${props => props.theme.colorPalette.text};
`


const states = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];

function App() {
  const [list, setList] = useState([]);

  const handleInput = (value) => {
    setList([...list, value]);
  }

  const colorScheme = useColorScheme();

  const themeWithSchemeSelected = {
    ...theme,
    colorPalette: colorScheme === 'dark' ? theme.colorPaletteDark : theme.colorPalette,
  }

  const GlobalStyle = createGlobalStyle`
    body {
      background-color: ${props => props.theme.colorPalette.background};
      padding: ${props => props.theme.padding};
    }
  `
  return (
    <ThemeProvider theme={themeWithSchemeSelected}>
      <GlobalStyle/>
      <Container>
        <Title>Free Association</Title>
        <List list={list}/>
        <Input onInput={handleInput}/>
      </Container>
    </ThemeProvider>
  );
}

export default App;
