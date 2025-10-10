import styled from "styled-components";

export const Container = styled.a`
    background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
    color: ${({ theme }) => theme.COLORS.GRAY_200};
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);

    padding: 1.5rem 1rem;
    border-radius: .43rem;

    display: flex;
    align-items: center;
    gap: 7px;
`;

export const Details = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;

    > h3 {
        font-size: 1.5;
        font-weight: 700;
        color: ${({ theme }) => theme.COLORS.BACKGROUND_100};
    }
`;

export const PublicationDate = styled.div`
    display: flex;
    font-style: italic;
    text-align: center;
    flex-direction: column;
    font-size: .6rem;
    font-weight: 600;
    color: ${({ theme }) => theme.COLORS.BLUE_100};
`;