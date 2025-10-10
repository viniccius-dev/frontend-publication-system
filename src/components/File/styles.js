import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    span {
        margin-left: 8px;
    }
`;