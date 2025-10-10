import styled from "styled-components";

export const Container = styled.div`
    padding: 1rem 1.5rem;
    grid-area: content;
    overflow-y: auto;

    header {
        display: flex;
        flex-direction: column;
        gap: 5px;

        small { 
            display: flex; 
            align-items: center; 
            gap: 4px 
        }

        strong, small, p {
            color: ${({ theme }) => theme.COLORS.GRAY_100}
        }
    }

    section h2 {
        margin-bottom: 1rem;
    }

    footer {
        display: flex;
        gap: 10px;
    }
`;

export const NotFound = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    justify-content: center;
`;