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

  const isValidStyledMemberExpression = (scope, memberExpression) => {
    const object = memberExpression.object;
    if (!types.isIdentifier(object)) return false;
    if (!isBindingFromLinaria(scope.getBinding(object.name), 'react')) {
      return false;
    }
    return true;
  };
  const isValidStyledCallExpression = (scope, callExpression) => {
    const callee = callExpression.callee;
    if (!types.isIdentifier(callee)) return false;
    if (!isBindingFromLinaria(scope.getBinding(callee.name), 'react')) {
      return false;
    }
    return true;
  };

  const transformLinariaTaggedTemplateExpression = {
    CallExpression(path) {
      const node = path.node;

      if (node.arguments && node.arguments[0] && types.isTaggedTemplateExpression(node.arguments[0])) {
        if (types.isMemberExpression(node.arguments[0].tag)) {
          if (!isValidStyledMemberExpression(path.scope, node.arguments[0].tag)) return;
          path.replaceWith(types.identifier('undefined'));
        } else if (types.isCallExpression(node.arguments[0].tag)) {
          if (!isValidStyledCallExpression(path.scope, node.arguments[0].tag)) return;
          path.replaceWith(types.identifier('undefined'));
        }
      }
    },
    TaggedTemplateExpression(path) {
      const { tag } = path.node;

      if (types.isIdentifier(tag)) {
        const binding = path.scope.getBinding(tag.name);
        if (isBindingFromLinaria(binding, 'core')) {
          path.replaceWith(types.identifier('undefined'));
        }
      } else if (types.isMemberExpression(tag)) {
        if (!isValidStyledMemberExpression(path.scope, tag)) return;
        path.replaceWith(types.identifier('undefined'));
      } else if (types.isCallExpression(tag)) {
        if (!isValidStyledCallExpression(path.scope, tag)) return;
        path.replaceWith(types.identifier('undefined'));
      }
    },
  };

  return {
    name: 'plugin-linaria-css-to-undefined',
    visitor: {
      Program: {
        enter(path, state) {
          path.traverse(transformLinariaTaggedTemplateExpression, state);
        },
        exit(path, state) {
          path.traverse(removeLinariaModuleReferences, state);
        },
      },
    },
  };
};
