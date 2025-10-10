import styled from "styled-components";

export const Container = styled.form`
    grid-area: content;
    padding: 1.25rem 1.5rem;

    overflow-y: auto;

    .currentFiles {
        padding: 20px 30px 1px 20px;
        border: ${({ theme }) => `1px solid ${theme.COLORS.GRAY_300}`};
        margin: 20px 0;
        border-radius: 20px;
        background-color: ${({ theme }) => theme.COLORS.GRAY_500};
    }
`;

export const InputWrapper = styled.div`
    width: 100%;

    > label {
        font-size: 1.1rem;
        font-weight: 600;
    }

    > div {
        margin-top: 5px;
    }

    .savedUploads {
        margin: 30px 0;
    }
`;

export const Archive = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.COLORS.WHITE_200};
    padding: 5px 5px 0 5px;
    margin-bottom: 5px;
    border-radius: 10px;

    > svg {
        margin-bottom: 7px;
        cursor: pointer;
        color: ${({ theme }) => theme.COLORS.RED_100};
    }
`;

export const NotFound = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    justify-content: center;
`;