import { createGlobalStyle } from 'styled-components';
import { DEVICE_BREAKPOINTS } from './deviceBreakpoints';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        text-decoration: none;
    }

    :root {
        font-size: 12px;

        @media (min-width: ${DEVICE_BREAKPOINTS.MD}) {
            font-size: 16px;
        }
    }

    body {
        background-color: ${({ theme }) => theme.COLORS.BACKGROUND_100};
        color: ${({ theme }) => theme.COLORS.BACKGROUND_900};

        --webkit-font-smoothing: antialiased;
    }

    body, input, button, textarea {
        font-family: "Open Sans", sans-serif;
        font-size: 1rem;
        outline: none;
    }
    
    button, a {
        cursor: pointer;
        transition: filter 0.2s;
    }

    button:hover, a:hover {
        filter: brightness(0.9);
    }

    ::-webkit-scrollbar {
        width: 6px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.COLORS.GRAY_100};
        border-radius: 3px;
        border: 2px solid transparent;
    }

    ::-webkit-scrollbar-button {
        display: none;
    }

    input[type="checkbox"] {
        margin-right: 5px;
        border: none;
    }
`;