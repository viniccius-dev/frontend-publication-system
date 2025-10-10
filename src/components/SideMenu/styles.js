import styled, { ThemeConsumer } from "styled-components";
import { DEVICE_BREAKPOINTS } from "../../styles/deviceBreakpoints";

export const Container = styled.aside`
    grid-area: none;
    background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};

    width: 100%;
    height: 100vh;

    display: flex;
    flex-direction: column;

    position: absolute;
    z-index: 1;

    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;

    &[data-menu-is-open="true"] {
        transform: translateX(0);
    }

    @media (min-width: ${DEVICE_BREAKPOINTS.MD}) {
        grid-area: menu;
        position: static;
        transform: none;
    }
`;

export const Header = styled.header`
    display: flex;
    justify-content: space-between;
    padding: 32px 24px;
    border-bottom: ${({ theme }) => `1px solid ${theme.COLORS.BROWN_200}`};
`;

export const Title = styled.h2`
    display: flex;
    align-items: center;
    gap: 7px;
    color: ${({ theme }) => theme.COLORS.BLUE_100};
    font-size: 1.5rem;
`;

export const Button = styled.button`
    background-color: transparent;
    border: none;
    display: flex;
    align-items: center;
    margin-left: 10px;

    > svg {
        font-size: 1.5rem;
        color: ${({ theme }) => theme.COLORS.BROWN_100};
    }
`;

export const Nav = styled.nav`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px 24px;
    overflow-y: auto;

    > a {
        position: relative;
        color: ${({ theme }) => theme.COLORS.WHITE_200};
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 15px 20px;
        border-radius: 25px;
        font-size: 16px;

        &[data-menu-active="true"] {
            background-color: ${({ theme }) => theme.COLORS.BROWN_200};
            color: ${({ theme }) => theme.COLORS.WHITE_100};
        }

        &[data-filters-active="true"] .bidsFilters {
            max-height: 200000px !important;
            transition: max-height 0.3s ease-in !important;
            padding-bottom: 15px !important;
        }

        svg:nth-of-type(2) {
            font-size: 20px;
            position: absolute;
            right: 24px;
            transition: transform 0.3s ease-in;

            &[data-filters-active="true"] {
                transform: rotate(-180deg);
            }
        }
    }

    a.bidsButton {
        padding: 0;
        flex-direction: column;
        height: auto;
        align-items: start;
        gap: 0;

        > div {
            padding: 15px 20px;
            width: 100%;
            display: flex;
            align-items: center;
            gap: 7px;

            ul {
                width: 100%;
                list-style-type: none;

                > label {
                    padding: 10px 20px;
                    margin-bottom: 5px;
                    width: 100%;
                    display: inline-block;
                    background-color: ${({ theme }) => theme.COLORS.BLUE_100};
                    color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
                }

                > li {
                    padding: 3px 35px;
                }
            }
        }

        div.bidsFilters {
            padding: 0;
            padding-bottom: 0;
            flex-direction: column;

            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
    }
`;

export const Footer = styled.footer`
    padding: 15px 24px;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    border-top: ${({ theme }) => `1px solide ${theme.COLORS.BROWN_200}`};
    gap: 7px;
    
    > img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
    }

    > div {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    > div strong {
        font-size: 0.88rem;
    }

    > div small {
        font-size: 0.75rem;
        word-break: break-all;
        min-width: 11.1rem;
    }
`;

export const Role = styled.div`
    user-select: none;
    display: flex;
    align-items: end;
    margin-left: 10px;
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    font-style: italic;
`;