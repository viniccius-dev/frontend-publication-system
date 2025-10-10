import styled from 'styled-components';
import { DEVICE_BREAKPOINTS } from '../../styles/deviceBreakpoints';

export const Container = styled.div`
    padding: 0 1.5rem;
    overflow-y: auto;
    grid-area: content;

    .usersLoading {
        height: 80%;
    }
`;

export const W50 = styled.div`
    display: flex;
    margin-bottom: 10px;
    flex-direction: column;

    @media (min-width: ${DEVICE_BREAKPOINTS.LG}) {
        flex-direction: row;
        gap: 10px;
    }
`;

export const InputWrapper = styled.div`
    width: 100%;

    &.buttons {
        margin-bottom: 8px;

        @media (min-width: ${DEVICE_BREAKPOINTS.SM}) {
            display: flex;
            align-items: end;
            gap: 10px;
        }
    }

    > label {
        font-size: 1.1rem;
        font-weight: 600;
    }

    > div {
        margin-top: 5px;
    }
`;