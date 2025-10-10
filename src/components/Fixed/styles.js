import styled from "styled-components";
import { DEVICE_BREAKPOINTS } from "../../styles/deviceBreakpoints";

export const Container = styled.div`
    width: 100%;
    height: 100vh;

    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 98px auto;
    grid-template-areas:
        "top"
        "content";

    @media (min-width: ${DEVICE_BREAKPOINTS.MD}) {
        grid-template-columns: 340px auto;
        grid-template-areas:
            "menu top"
            "menu content";
    }
`;

export const FixedContent = styled.section`
    grid-area: top;
`;