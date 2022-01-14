

exports.actual = `
import { css } from '@linaria/core';
const className = css\`
  display: flex;
\`;
`;

exports.expected = `
const className = undefined;
`;
