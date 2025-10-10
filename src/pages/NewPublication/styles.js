import styled from "styled-components";
import { DEVICE_BREAKPOINTS } from "../../styles/deviceBreakpoints";

export const Container = styled.form`
    grid-area: content;
    padding: 1.25rem 1.5rem;

    overflow-y: auto;
`;

export const W50 = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    flex-direction: column;

    &:last-of-type {
        margin-top: 20px;

        > div:last-of-type {
            display: flex;
            align-items: end;
            margin-top: 0;
            margin-bottom: 8px;
        }
    }

    @media (min-width: ${DEVICE_BREAKPOINTS.LG}) {
        flex-direction: row;
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
`;