import styled from 'styled-components';

export const Container = styled.section`
    padding: 1.75rem 0 1rem;
    margin-bottom: 1rem;
    border-bottom: ${({ theme }) => `2px solid ${theme.COLORS.GRAY_200}`};
`;