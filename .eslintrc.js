module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        mocha: true,
    },
    extends: [
        'standard',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        'no-const-assign': 'warn',
        'no-this-before-super': 'warn',
        'no-undef': 'warn',
        'no-unreachable': 'warn',
        'no-unused-vars': 'warn',
        'constructor-super': 'warn',
        'valid-typeof': 'warn',
        'no-console': 0,
        indent: ['error', 4],
        semi: [2, 'always'], // 行尾分号
        'eol-last': 0, // 以新行结束文件
        'comma-dangle': 0, // 对象属性逗号结尾
        'spaced-comment': 0 // 注释前空格
    },
};
