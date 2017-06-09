module.exports = {
    parserOptions: {
        ecmaVersion: 2016,
        sourceType: "module",
    },
    env: {
        es6: true,
        node: true
    },
    extends: "xo-space",
    rules: {
        "indent": 0,
        "no-inline-comments": 0,
        "no-warning-comments": 0,
        "quotes": ["error","double"],
        "curly": ["error","multi-or-nest"],
        "object-curly-spacing": ["error", "always"],
        "spaced-comment": ["error", "always",
            { "markers": ["TODO:", "NOTE:", "FIXME:"] }]
    }
};
