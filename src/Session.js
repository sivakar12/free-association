import React, { useEffect, useState } from 'react';
import Sentiment from 'sentiment'
import { collection, addDoc, Timestamp } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import styled from "styled-components";

import Results from './Results'
import Config from './Config'
import Input from "./Input"
import List from "./List"

import { db } from './firebase'

const Container = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  background-color: ${props => props.theme.colorPalette.background};
  color: ${props => props.theme.colorPalette.text};
`



const states = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
const timeInSeconds = 90;

export default function Session() {

    const [state, setState] = useState(states[0]);
    const [list, setList] = useState([]);
    const [results, setResults] = useState({});

    const saveSessionData = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          await addDoc(collection(db, "sessions"), {
            user: currentUser.uid,
            list: list,
            timestamp: Timestamp.now(),
          });
        }
      }
    
    useEffect(() => {
        if (state === "IN_PROGRESS") {
        setTimeout(() => {
            setState("COMPLETED");
        }, timeInSeconds * 1000)
        }
        if (state === "COMPLETED") {
        saveSessionData();
        const sentiment = new Sentiment();
        const results = sentiment.analyze(list.join(' '));
        setResults(results)
        }
    // eslint-disable-next-line
    }, [state])

    const handleInput = (value) => {
        if (state === "NOT_STARTED") {
          setState("IN_PROGRESS");
        }
        if (state === "IN_PROGRESS" || state === "NOT_STARTED") {
          setList([...list, value]);
        }
    }
    return (
        <Container>
            { state === "NOT_STARTED" && <Config/> }
            { state === "IN_PROGRESS" && <List list={list}/> }
            { state === "COMPLETED" && <Results results={results}/> }
            <Input state={state} onInput={handleInput}/>
        </Container>
    )
}
