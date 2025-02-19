module.exports = {
    root: true,
    parser: 'babel-eslint',
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended', // Integrate Prettier with ESLint
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        'react/prop-types': 'off', // Customize rules as needed
    },
};
