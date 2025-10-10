import styled from 'styled-components';

export const Container = styled.div`
    cursor: pointer;
    width: 150px;
    height: 35px;
    margin: 10px 0;
    border-radius: 5px;

    background-color: ${props => props.checked ? '#FF5400' : '#D9D9D9'};

    display: flex;
    align-items: center;
`;

export const HiddenCheckbox = styled.input.attrs({type: 'checkbox'})`
    overflow: hidden;
    white-space: nowrap;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
`;

export const Text = styled.label`
    cursor: pointer;
    color: ${props => props.checked ? '#FFF' : '#555'};
    user-select: none;
`;

export const StyledCheckbox = styled.label`
    cursor: pointer;
    width: 23px;
    height: 23px;
    margin-right: 6px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.COLORS.WHITE_100};

    display: flex;
    justify-content: center;
    align-items: center;

    svg {
        display: ${props => props.checked ? 'flex' : 'none'};
        color: #FF5400;
    }
`;