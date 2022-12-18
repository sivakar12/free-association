import styled from "styled-components"

const ListBox = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: start;
    width: 100%;
    height: 100%;
    overflow: auto;
`

const ListItem = styled.div`
    border-color: ${props => props.theme.colorPalette.accent};
    border-style: solid;
    border-width: 2px;
    margin: 2px;
    padding: ${props => props.theme.padding};
    font-size: ${props => props.theme.fontSizes[2]};
    border-radius: ${props => props.theme.borderRadius};
`

export default function List(props) {
    return (
        <ListBox>
            {props.list.map((item, index) => (
                <ListItem key={index}>{item}</ListItem>
            ))}
        </ListBox>
    )
}