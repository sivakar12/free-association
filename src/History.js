import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import relativeType from "dayjs/plugin/relativeTime";

import { getDocs, collection, query, where, orderBy, limit } from "firebase/firestore"; 

import { AuthContext, db } from "./firebase";

dayjs.extend(relativeType)

const Title = styled.h3`
    text-align: center;
    margin: 0;
    font-size: ${props => props.theme.fontSizes[0]};
    background-color: ${props => props.theme.colorPalette.background2};
    color: ${props => props.theme.colorPalette.text};
`

const SessionItem = styled.div`
    margin: 10px;
    background-color: ${props => props.theme.colorPalette.background2};
    border-radius: ${props => props.theme.borderRadius};
    color: ${props => props.theme.colorPalette.text};
    cursor: pointer;
`

const SessionItemDate = styled.div`
    padding: 4px;
    font-size: ${props => props.theme.fontSizes[2]};
`

const SessionItemWords = styled.div`
    display: flex;
    width: 100%;
    overflow-x: scroll;
`

const SessionItemWord = styled.div`
    padding: 4px;
    margin: 4px;
    border-radius: ${props => props.theme.borderRadius};
    border: 1px solid ${props => props.theme.colorPalette.accent};
    background-color: ${props => props.theme.colorPalette.background};
    font-size: ${props => props.theme.fontSizes[0]};
`

const formatTimestamp = (timestamp) => {
    return dayjs(timestamp).fromNow() + " (" + dayjs(timestamp).format("MMMM D, YYYY h:mm A	") + ")";
}
const Session = (props) => {
    return (
        <SessionItem>
            <SessionItemDate>{formatTimestamp(props.session.timestamp.seconds * 1000)}</SessionItemDate>
            <SessionItemWords>
                {props.session.list.map((word, index) => <SessionItemWord key={index}>{word}</SessionItemWord>)}
            </SessionItemWords>
        </SessionItem>
    )
}

export default function History() {
    const [sessions, setSessions] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const title = currentUser ? `History for ${currentUser.displayName}` : `Login to view history`;

    const getData = async () => {
        const sessionsRef = collection(db, "sessions");
        const q = query(sessionsRef, where("user", "==", currentUser.uid), orderBy("timestamp", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        // set to state
        setSessions(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    }

    useEffect(() => {
        if (currentUser) {
            getData();
        }
    // eslint-disable-next-line
    }, [currentUser])
    return (
        <div>
            <Title>{title}</Title>
            <div>
                {sessions.map((session, index) => {
                    return <Session key={index} session={session} />
                })}
            </div>
        </div>
    )
}
