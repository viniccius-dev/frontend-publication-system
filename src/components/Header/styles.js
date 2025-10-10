import styled from "styled-components";
import { DEVICE_BREAKPOINTS } from "../../styles/deviceBreakpoints";

export const Container = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 1.5rem;
    padding: 1rem 0;
    border-bottom: ${({ theme }) => `1px solid ${theme.COLORS.GRAY_200}`};

    > h1 {
        font-size: 1.5rem;
        flex: 1;
        padding: 0 1rem;
    }

    > button:nth-last-of-type(n) {
        max-width: 230px;
        min-height: 3rem;
        margin: 0;
    }

    @media (min-width: ${DEVICE_BREAKPOINTS.MD}) {
        > h1 {
            padding: 0 1rem 0 0;
        }
    }
`;

export const Menu = styled.button`
    background: none;
    border: none;
    display: flex;
    align-items: center;

    > svg {
        font-size: 1.3rem;
        color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
    }

    @media (min-width: ${DEVICE_BREAKPOINTS.XS}) {
        > svg {
            font-size: 1.8rem;
        }
    }

    @media (min-width: ${DEVICE_BREAKPOINTS.MD}) {
        display: none;
    }
`;