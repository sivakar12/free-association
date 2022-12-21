import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { getDocs, collection, query, where, orderBy, limit } from "firebase/firestore"; 

import { AuthContext, db } from "./firebase";
import { Link } from "react-router-dom";

const Title = styled.h3`
    text-align: center;
    font-size: ${props => props.theme.fontSizes[0]};
    background-color: ${props => props.theme.colorPalette.background2};
    color: ${props => props.theme.colorPalette.text};
`

const SessionItem = styled.div`
    background-color: ${props => props.theme.colorPalette.background2};
    color: ${props => props.theme.colorPalette.text};
    cursor: pointer;
`

const Session = (props) => {
    return (
        <Link to={props.session.id}>
            <SessionItem>
                <p>{new Date(props.session.timestamp.seconds * 1000).toISOString()}</p>
                <p style={{'wordWrap': 'break-word'}}>{props.session.list.toString()}</p>
            </SessionItem>
        </Link>
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
