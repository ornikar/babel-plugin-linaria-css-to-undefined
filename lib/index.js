/* eslint-disable no-param-reassign */
/* eslint-disable filenames/match-exported */

const targets = ['@linaria/core', '@linaria/react'];

const removeLinariaModuleReferences = {
  ImportDeclaration(path, state) {
    const { source } = path.node;

    if (!targets.includes(source.value)) {
      return;
    }
    path.remove();
  },
};

module.exports = function babelPluginLinariaCssToUndefined({ types }, opts) {
  const isBindingFromLinaria = (binding, linariaLib) => {
    if (!binding || !types.isImportDeclaration(binding.path.parent)) {
      return false;
    }
    if (!types.isStringLiteral(binding.path.parent.source)) return false;
    return binding.path.parent.source.value === '@linaria/' + linariaLib;
  };

  return {
    name: 'plugin-linaria-css-to-undefined',
    visitor: {
      Program: {
        exit(path, state) {
          path.traverse(removeLinariaModuleReferences, state);
        },
      },
      VariableDeclarator({ node, scope }, { file }) {
        const isValidStyledMemberExpression = (memberExpression) => {
          const object = memberExpression.object;
          if (!types.isIdentifier(object)) return false;
          if (!isBindingFromLinaria(scope.getBinding(object.name), 'react')) {
            return false;
          }
          return true;
        };

        if (types.isTaggedTemplateExpression(node.init)) {
          const taggedTemplateExpression = node.init;
          const { tag } = taggedTemplateExpression;

          if (types.isIdentifier(tag)) {
            const binding = scope.getBinding(tag.name);
            if (isBindingFromLinaria(binding, 'core')) {
              node.init = types.identifier('undefined');
            }
          }

          if (types.isMemberExpression(tag)) {
            if (!isValidStyledMemberExpression(tag)) return;
            node.init = types.identifier('undefined');
          }
        }

        if (
          types.isCallExpression(node.init) &&
          node.init.arguments &&
          node.init.arguments[0] &&
          types.isTaggedTemplateExpression(node.init.arguments[0]) &&
          types.isMemberExpression(node.init.arguments[0].tag)
        ) {
          const taggedTemplateExpression = node.init.arguments[0];
          const { tag } = taggedTemplateExpression;
          if (!isValidStyledMemberExpression(tag)) return;
          node.init = types.identifier('undefined');
        }
      },
    },
  };
};
