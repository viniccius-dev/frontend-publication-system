import styled from 'styled-components';
import backgroundImg from '../../assets/background-login.jpg';

import { DEVICE_BREAKPOINTS } from '../../styles/deviceBreakpoints';

export const Container = styled.div`
    height: 100vh;
    display: flex;
    align-items: stretch;
    justify-content: center;
`;

export const Form = styled.form`
    padding: 0 10%;
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    > h2 {
        font-size: 1.8rem;
        margin: 3rem 0;
    }

    > img {
        width: 85%;
        min-width: 18rem;
        object-fit: cover;
    }

    @media (min-width: ${DEVICE_BREAKPOINTS.MD}) {
        padding: 0 8.5rem;
        width: auto;

        > img {
            width: auto;
            margin: 0;
        }
    }
`;

export const Background = styled.div`
    flex: 1;
    background: url(${backgroundImg}) no-repeat 35%;
    background-size: cover;

    display: none;

    @media (min-width: ${DEVICE_BREAKPOINTS.LG}) {
        display: block;
    }
`;