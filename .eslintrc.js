module.exports = {
    env: {
        browser: true,
        commonjs: true,
    },
    extends: ['@broxus'],
    // parserOptions: {
    //     project: './tsconfig.json'
    // },
    overrides: [
        {
            files: ['*.d.ts', '**/*/types.ts'],
            rules: {
                camelcase: 'off',
                'max-len': 'off',
            },
        },
        {
            files: ['*.abi.ts'],
            rules: {
                camelcase: 'off',
                'max-len': 'off',
                'sort-keys': 'off',
            },
        },
    ],

    root: true,

    rules: {
        'import/extensions': ['error', 'never', {json: 'always', scss: 'always', svg: 'always'}],
        'no-await-in-loop': 'off',
        'no-restricted-syntax': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'max-classes-per-file': 'off',
        'react/no-multi-comp': 'off',
    },

    settings: {
        'import/extensions': ['.ts', '.tsx', '.js', '.scss', '.css', 'svg'],
        // 'import/external-module-folders': ['node_modules', 'node_modules/@types'],
        // 'import/resolver': {
        //     'eslint-import-resolver-webpack': {},
        //     node: {
        //         extensions: ['.js', '.jsx', '.ts', '.tsx'],
        //     },
        // },
    },
}
