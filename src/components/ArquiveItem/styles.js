import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    align-items: center;

    background-color: ${({ theme, $isNew }) => $isNew ? "transparent" : theme.COLORS.GRAY_100};
    color: ${({ theme, $isNew }) => $isNew ?  theme.COLORS.GRAY_100 : theme.COLORS.WHITE_100};

    border: ${({ theme, $isNew }) => $isNew ? `1px dashed ${theme.COLORS.GRAY_100}` : "none"};

    margin-bottom: 8px;
    border-radius: 10px;
    padding-right: ${({ $isNew }) => $isNew ? "none" : "16px"};

    > button {
        border: none;
        background: none;
    }

    .button-delete {
        color: ${({ theme }) => theme.COLORS.RED_100};
    }

    .button-add {
        color: ${({ theme }) => theme.COLORS.GRAY_100};
    }

    > input {
        height: 55px;
        width: 100%;

        padding: 12px;

        color: ${({ theme, $isNew }) => $isNew ? theme.COLORS.BACKGROUND_900 : theme.COLORS.WHITE_100};
        background: transparent;

        border: none;

        &::placeholder {
            color: ${({ theme }) => theme.COLORS.GRAY_100};
        }
        &:hover {
            cursor: pointer;
            text-decoration: underline;
        }
    }

    > label {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        height: 55px;
        width: 100%;

        padding: 12px;

        input {
            display: none;
        }

        span {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    }
`;