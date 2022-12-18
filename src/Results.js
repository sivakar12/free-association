import styled from 'styled-components'

const ResultsContainer = styled.div`
    padding: ${props => props.theme.padding};
`

export default function Results(props) {
    return (
        <ResultsContainer>
            {JSON.stringify(props.results, null, 2)}
        </ResultsContainer>
    )
}