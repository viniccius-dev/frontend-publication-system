// import styled from 'styled-components';

// export const Container = styled.div`
//     padding: 16px 24px;
//     display: flex;
//     flex-direction: column;
//     @media (max-width: 900px) {
//         padding: 12px 12px;
//     }
// `;

// export const Row = styled.div`
//     display: flex;
//     gap: 16px;
//     align-items: flex-start;
//     flex-wrap: wrap;
//     @media (max-width: 900px) {
//         gap: 12px;
//         flex-direction: column;
//     }
// `;

// export const Column = styled.div`
//     flex: 1;
//     display: flex;
//     flex-direction: column;
//     gap: 12px;
//     @media (max-width: 900px) {
//         gap: 10px;
//     }
// `;

// export const Actions = styled.div`
//     margin-top: 12px;
//     display: flex;
//     gap: 8px;
// `;

// export const Preview = styled.div`
//     margin-top: 8px;
//     background: #fff;
//     padding: 12px;
//     border-radius: 6px;
//     box-shadow: 0 1px 3px rgba(0,0,0,0.05);
// `;



import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px 24px;
  background: transparent;

  @media (max-width: 900px) {
    padding: 12px;
    gap: 20px;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
  background: transparent;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: transparent;

  @media (max-width: 900px) {
    gap: 10px;
  }
`;

export const Actions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    button {
      width: 100%;
    }
  }
`;

export const Preview = styled.div`
  margin-top: 12px;
  background: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-size: 14px;
  color: #333;
  word-break: break-word;

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 4px;
  }

  @media (max-width: 600px) {
    padding: 10px;
    font-size: 13px;
  }
`;
