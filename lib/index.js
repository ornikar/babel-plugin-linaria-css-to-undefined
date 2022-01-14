/* eslint-disable no-param-reassign */
/* eslint-disable filenames/match-exported */

const targets = ['@linaria/core'];

const removeLinariaModuleReferences = {
  ImportDeclaration(path, state) {
    const { source } = path.node;

    if (!targets.includes(source.value)) {
      return;
    }
    path.remove();
  },
};

module.exports = function babelPluginLinariaReactNativeWebOnly({ types }, opts) {
  const isBindingFromLinaria = (binding) => {
    if (!binding || !types.isImportDeclaration(binding.path.parent)) {
      return false;
    }
    if (!types.isStringLiteral(binding.path.parent.source)) return false;
    return binding.path.parent.source.value === '@linaria/core';
  };

  return {
    name: 'plugin-linaria-react-native-web-only',
    visitor: {
      Program: {
        exit(path, state) {
          path.traverse(removeLinariaModuleReferences, state);
        },
      },
      VariableDeclarator({ node, scope }, { file }) {
        if (!types.isTaggedTemplateExpression(node.init)) return;
        const taggedTemplateExpression = node.init;
        const { tag } = taggedTemplateExpression;

        if (types.isIdentifier(tag)) {
          const binding = scope.getBinding(tag.name);
          if (isBindingFromLinaria(binding)) {
            node.init = types.identifier('undefined');
          }
        }
      },
    },
  };
};
