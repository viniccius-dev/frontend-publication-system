import styled from 'styled-components';
import { DEVICE_BREAKPOINTS } from '../../styles/deviceBreakpoints';

export const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 12px;
  gap: 20px;
  flex-direction: column;
  background: transparent;
  overflow-y: auto;

  @media (min-width: ${DEVICE_BREAKPOINTS.LG}) {
    gap: 24px;
    padding: 16px 24px;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-wrap: wrap;
  background: transparent;

  section {
    width: 100%;
    position: relative;
  }

  @media (min-width: ${DEVICE_BREAKPOINTS.LG}) {
    section {
      width: calc(50% - 10px);
      min-height: 300px;
    }

    gap: 20px;
    flex-direction: row;
  }
`;

export const Actions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  position: absolute;
  width: 100%;
  bottom: 0;

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
