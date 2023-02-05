module.exports = {
  plugins: ['boundaries'],
  extends: ['plugin:boundaries/recommended'],
  settings: {
    // configuring layers on the project architecture
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    'boundaries/elements': [
      {
        type: 'domain',
        pattern: 'src/domain/*',
      },
      {
        type: 'application',
        pattern: 'src/application/*',
      },
      {
        type: 'adapters',
        pattern: 'src/adapters/*',
      },
      {
        type: 'infrastructure',
        pattern: 'src/infrastructure/*',
      },
    ],
    'boundaries/ignore': ['**/*.spec.js', '**/*.spec.ts'],
  },
  rules: {
    // plugin for ensuring architecture dependency rule
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        rules: [
          {
            from: 'domain',
            allow: ['domain'],
          },
          {
            from: 'application',
            allow: ['application', 'domain'],
          },
          {
            // ignoring dependency rule in adapters on behalf of a more pragmatic approach, thus allowing imports from infrastructure
            from: 'adapters',
            allow: ['infrastructure', 'adapters', 'application', 'domain'],
          },
          {
            from: 'infrastructure',
            allow: ['infrastructure', 'adapters', 'application', 'domain'],
          },
        ],
      },
    ],
    // architecture external dependences rules
    'boundaries/external': [
      2,
      {
        default: 'disallow',
        rules: [
          {
            from: 'domain',
            disallow: ['*'],
          },
          {
            from: 'application',
            allow: [['@nestjs/common', { specifiers: ['Injectable'] }]],
            disallow: [['@nestjs/common', { specifiers: ['Logger'] }]],
          },
          {
            // ignoring dependency rule in adapters on behalf of a more pragmatic approach, thus allowing external imports
            from: 'adapters',
            allow: ['@nestjs/*', '*'],
            disallow: [['@nestjs/common', { specifiers: ['Logger'] }]],
          },
          {
            from: 'infrastructure',
            allow: ['@nestjs/*', '*'],
          },
        ],
      },
    ],
  },
};
