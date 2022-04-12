exports.babelPlugins = ['babel-plugin-istanbul'];

exports.actual = `
import { styled } from '@linaria/react';

const WebOnlyRedDiv = styled.div\`
  background-color: red;
\`;
`;

exports.expected = `
function cov_2fkpq21spa() {
  var path = "/home/chris/ornikar/babel-plugin-linaria-css-to-undefined/linaria-react-with-jest-coverage.js";
  var hash = "641c4e07266aed2ba831a7dcc14b02f97825dcee";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/chris/ornikar/babel-plugin-linaria-css-to-undefined/linaria-react-with-jest-coverage.js",
    statementMap: {
      "0": {
        start: {
          line: 4,
          column: 22
        },
        end: {
          line: 6,
          column: 1
        }
      }
    },
    fnMap: {},
    branchMap: {},
    s: {
      "0": 0
    },
    f: {},
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "641c4e07266aed2ba831a7dcc14b02f97825dcee"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2fkpq21spa = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2fkpq21spa();
const WebOnlyRedDiv = (cov_2fkpq21spa().s[0]++, undefined);
`;
