exports.actual = `
import { styled as styledLinaria } from '@linaria/react';

const WebOnlyRedDiv = styledLinaria.div\`
  background-color: red;
\`;
`;

exports.expected = `
const WebOnlyRedDiv = undefined;
`;
