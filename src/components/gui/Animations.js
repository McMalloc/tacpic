import {keyframes} from "styled-components/macro";

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

export const slideFromAbove = keyframes`
  from {
    transform: translateY(-30px);
  }

  to {
    transform: translateY(0);
  }
`;