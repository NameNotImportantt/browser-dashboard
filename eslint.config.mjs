import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {FlatCompat} from '@eslint/eslintrc';
import js from '@eslint/js';
import stylisticPlugin from '@stylistic/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import {defineConfig, globalIgnores} from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

const eslintConfig = defineConfig([
    ...compat.extends(
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:@typescript-eslint/recommended',
    ),
    ...compat.env({
        browser: true,
        node: true,
        es6: true,
        jest: true,
    }),
    {
        files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            '@stylistic': stylisticPlugin,
            jest: jestPlugin,
            import: importPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx'],
            },
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
                typescript: true,
            },
        },
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['../**/module/*'],
                            message: 'Use package imports for other modules',
                        },
                        {
                            group: ['@universe*/**/dist', '@unidata*/**/dist'],
                            message: 'Import from package root, not dist',
                        },
                    ],
                },
            ],
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'type',
                    ],
                    pathGroups: [
                        {
                            pattern: 'react*',
                            group: 'external',
                            position: 'before',
                        },
                        {
                            pattern: 'mobx*',
                            group: 'external',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                    'newlines-between': 'never',
                },
            ],
            'import/first': 'error',
            'import/no-duplicates': 'error',
            'import/extensions': [
                'error',
                'ignorePackages',
                {
                    js: 'never',
                    jsx: 'never',
                    ts: 'never',
                    tsx: 'never',
                },
            ],
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'separate-type-imports',
                },
            ],
            '@typescript-eslint/parameter-properties': [
                'error',
                {
                    prefer: 'class-property',
                },
            ],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                },
            ],
            '@typescript-eslint/array-type': [
                'error',
                {
                    default: 'array-simple',
                },
            ],
            '@stylistic/member-delimiter-style': [
                'error',
                {
                    multiline: {
                        delimiter: 'semi',
                        requireLast: true,
                    },
                    singleline: {
                        delimiter: 'semi',
                        requireLast: false,
                    },
                    multilineDetection: 'brackets',
                },
            ],
            '@typescript-eslint/no-use-before-define': [
                'error',
                {
                    classes: true,
                    variables: true,
                    functions: false,
                    typedefs: true,
                    enums: true,
                    ignoreTypeReferences: true,
                },
            ],
            semi: ['error', 'always'],
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1,
                    ignoredNodes: ['TemplateLiteral *'],
                },
            ],
            'max-len': [
                'error',
                {
                    code: 140,
                    ignoreComments: true,
                    ignoreRegExpLiterals: true,
                    ignoreTemplateLiterals: true,
                },
            ],
            quotes: [
                'error',
                'single',
                {
                    allowTemplateLiterals: true,
                    avoidEscape: true,
                },
            ],
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'object-curly-spacing': ['error', 'never'],
            'no-mixed-spaces-and-tabs': 'error',
            'no-tabs': 'error',
            'no-trailing-spaces': 'error',
            'no-multi-spaces': 'error',
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 1,
                    maxEOF: 1,
                    maxBOF: 0,
                },
            ],
            'padding-line-between-statements': [
                'error',
                {
                    blankLine: 'always',
                    prev: 'block-like',
                    next: '*',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'block-like',
                },
                {
                    blankLine: 'always',
                    prev: ['const', 'let', 'var'],
                    next: '*',
                },
                {
                    blankLine: 'any',
                    prev: ['const', 'let', 'var'],
                    next: ['const', 'let', 'var'],
                },
                {
                    blankLine: 'always',
                    prev: 'multiline-const',
                    next: 'singleline-const',
                },
                {
                    blankLine: 'always',
                    prev: 'singleline-const',
                    next: 'multiline-const',
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: 'export',
                },
                {
                    blankLine: 'always',
                    prev: 'export',
                    next: '*',
                },
            ],
            'react/jsx-wrap-multilines': [
                'error',
                {
                    declaration: 'parens-new-line',
                    assignment: 'parens-new-line',
                    return: 'parens-new-line',
                    arrow: 'parens-new-line',
                    condition: 'parens-new-line',
                    logical: 'parens-new-line',
                    prop: 'parens-new-line',
                },
            ],
            'react/jsx-first-prop-new-line': ['error', 'multiline'],
            'react/jsx-indent': ['error', 4],
            'react/jsx-indent-props': ['error', 4],
        },
    },
    {
        files: ['**/*.ts'],
        rules: {
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {
                    accessibility: 'explicit',
                },
            ],
        },
    },
    {
        files: ['eslint.config.mjs', 'next.config.ts', 'postcss.config.mjs'],
        rules: {
            'no-restricted-syntax': 'off',
        },
    },
    {
        files: ['**/*.tsx'],
        rules: {
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {
                    accessibility: 'no-public',
                },
            ],
        },
    },
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'dist-vite/**',
        'public-multi/**',
        'next-env.d.ts',
        '**/*.module.scss.d.ts',
    ]),
]);

export default eslintConfig;
