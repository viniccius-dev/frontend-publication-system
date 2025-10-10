import styled from "styled-components";

export const Container = styled.div`
    position: relative;
    user-select: none;
    margin-bottom: 8px;
`;

export const SelectButton = styled.div`
    height: 3rem;
    display: flex;
    padding: 0.75rem;
    align-items: center;
    justify-content: space-between;

    border-radius: 10px;
    background-color: ${({ theme }) => theme.COLORS.GRAY_100};
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.4);
`;

export const Chevrons = styled.div`
    color: ${({ theme }) => theme.COLORS.WHITE_100};
    font-size: 1.25rem;
    transition: transform 0.3s ease-in-out;

    &[data-is-open="true"] {
        transform: rotate(180deg);
    }
`;

export const OptionList = styled.div`
    max-height: 0;
    transition: max-height 0.3s ease-in-out;
    z-index: 2;
    position: absolute;
    width: 100%;

    overflow-y: auto;

    margin-top: 0.25rem;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.COLORS.GRAY_300};
    color: ${({ theme }) => theme.COLORS.BACKGROUND_900};

    &[data-is-open="true"] {
        max-height: 2000px;
    }
`;

export const Option = styled.li`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;

    padding: 0.75rem;

    &:not(:nth-last-of-type(1)) {
        border-bottom: ${({ theme }) => `1px solid ${theme.COLORS.WHITE_200}`};
    }

    svg {
        margin-left: auto;
        color: ${({ theme }) => theme.COLORS.BROWN_200}
    }

    > input[type="radio"] {
        all: unset;
        position: absolute;
        inset: 0;
        cursor: pointer;
    }

    &:has(input:checked),
    &:hover {
        background: ${({ theme }) => theme.COLORS.GRAY_500};
        color: ${({ theme }) => theme.COLORS.BROWN_200};
    }

    &:has(input:focus) {
        outline: ${({ theme }) => `1px solid ${theme.COLORS.BROWN_200}`};
    }
`;