import React from 'react'
import styled from 'styled-components'

interface Props {
    message:string
}

export const Error = ({message}: Props) => {
    return (
        <Error.Wrapper>
            {message}
        </Error.Wrapper>
    )
}
Error.Wrapper = styled.code`
    font-size:14px;
    color:#f1c000;
`