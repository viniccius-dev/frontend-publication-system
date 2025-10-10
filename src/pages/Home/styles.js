import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    grid-area: content;
    padding: 0 1.5rem;
    margin-bottom: .2rem;
    overflow-y: auto;

    .homeLoading {
        height: 65%;
    }
`;

export const Publications = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;