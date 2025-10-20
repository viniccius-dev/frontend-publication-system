import styled from "styled-components";
import { DEVICE_BREAKPOINTS } from '../../styles/deviceBreakpoints';

export const Container = styled.div`
    border: ${({ theme }) => `1px dashed ${theme.COLORS.GRAY_100}`};
    background-color: ${({ theme }) => theme.COLORS.GRAY_500};
    min-height: 120px;
    max-height: 220px;
    border-radius: 0.43rem;
    margin: 5px 0;

    display: flex;
    gap: 1rem;
    padding: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    overflow: auto;

    @media (min-width: ${DEVICE_BREAKPOINTS.MD}) {
        justify-content: left;
        align-items: start;
    }
    
    &.dragging {
        border-color: ${({ theme }) => theme.COLORS.PRIMARY_900};
        background-color: ${({ theme }) => theme.COLORS.GRAY_400};
    }

    .drop-hint {
        width: 100%;
        text-align: center;
        color: ${({ theme }) => theme.COLORS.GRAY_100};
        font-size: 13px;
        margin: 6px 0 8px 0;
    }
`;