import styled from 'styled-components';
import { DEVICE_BREAKPOINTS } from '../../styles/deviceBreakpoints';

export const Container = styled.div`
    padding: 0 1.5rem;
    overflow-y: auto;
    grid-area: content;
`;

export const W50 = styled.div`
    display: flex;
    align-items: end;
    flex-direction: column;

    @media (min-width: ${DEVICE_BREAKPOINTS.LG}) {
        flex-direction: row;
        gap: 10px;

        > div, button {
            width: 50%;
        }

        .button {
            margin-bottom: 8px;
        }
    }
`;

export const InputWrapper = styled.div`
    width: 100%;

    &:not(:first-of-type) {
        margin-top: 10px;
    }

    > label {
        font-size: 1.1rem;
        font-weight: 600;
    }

    > div {
        margin-top: 5px;
    }
`;