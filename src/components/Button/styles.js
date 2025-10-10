import styled from 'styled-components';

export const Container = styled.button`
    width: 100%;

    background-color: ${({ theme, $background }) => $background === "default" ? theme.COLORS.BLUE_100 : theme.COLORS.BROWN_200};
    color: ${({ theme, $background }) => $background === "default" ? theme.COLORS.BACKGROUND_900 : theme.COLORS.WHITE_100};
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);

    min-height: 3rem;
    border: 0;
    padding: .5rem 1rem;
    margin-top: 1rem;
    border-radius: .63rem;
    font-weight: 700;

    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    > svg {
        font-size: .9rem;
    }

    &:disabled {
        opacity: 0.8;
    }
`;