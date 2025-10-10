import styled from "styled-components";

export const Container = styled.section`
    margin: 1.75rem 0;

    > h2 {
        border-bottom: ${({ theme }) => `2px solid ${theme.COLORS.GRAY_300}`};
        padding-bottom: 1rem;
        margin-bottom: 1.5rem;

        color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
        font-size: 1.3rem;
        font-weight: 500;
    }
`;