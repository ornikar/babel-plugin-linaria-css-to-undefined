exports.actual = `
import { styled } from '@linaria/react';

const WebOnlyRedDiv = styled('div')\`
  background-color: red;
\`;
`;

exports.expected = `
const WebOnlyRedDiv = undefined;
`;
