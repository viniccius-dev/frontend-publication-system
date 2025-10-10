import styled from "styled-components";
import { DEVICE_BREAKPOINTS } from '../../styles/deviceBreakpoints';

export const Container = styled.div`
    border: ${({ theme }) => `1px dashed ${theme.COLORS.GRAY_100}`};
    background-color: ${({ theme }) => theme.COLORS.GRAY_500};
    min-height: 154px;
    border-radius: 0.43rem;
    margin: 5px 0;

    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    @media (min-width: ${DEVICE_BREAKPOINTS.MD}) {
        justify-content: left;
        align-items: start;
    }
`;