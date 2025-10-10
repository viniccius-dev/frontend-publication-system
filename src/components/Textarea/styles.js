import styled from "styled-components";

export const Container = styled.textarea`
    width: 100%;
    height: 9.38rem;

    background-color: ${({ theme }) => theme.COLORS.GRAY_100};
    color: ${({ theme }) => theme.COLORS.WHITE_100};

    border: none;
    resize: none;

    margin-top: 5px;
    margin-bottom: 10px;
    border-radius: .63rem;
    padding: .75rem;

    &::placeholder {
        color: ${({ theme }) => theme.COLORS.GRAY_300};
    }
`;