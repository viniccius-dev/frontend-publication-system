import styled from 'styled-components';

export const Container = styled.div`
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    @media (max-width: 900px) {
        padding: 12px 12px;
    }
`;

export const Row = styled.div`
    display: flex;
    gap: 16px;
    align-items: flex-start;
    flex-wrap: wrap;
    @media (max-width: 900px) {
        gap: 12px;
        flex-direction: column;
    }
`;

export const Column = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    @media (max-width: 900px) {
        gap: 10px;
    }
`;

export const Actions = styled.div`
    margin-top: 12px;
    display: flex;
    gap: 8px;
`;

export const Preview = styled.div`
    margin-top: 8px;
    background: #fff;
    padding: 12px;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;
