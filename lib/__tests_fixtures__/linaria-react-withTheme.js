exports.actual = `
import { styled } from '@linaria/react';
import { withTheme } from './withTheme';

const WebOnlyRedDiv = withTheme(styled.div\`
  background-color: red;
\`);
`;

exports.expected = `
import { withTheme } from './withTheme';
const WebOnlyRedDiv = undefined;
`;
