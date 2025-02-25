module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production'
      ? {
          'postcss-preset-env': {
            stage: 3,
            features: {
              'nesting-rules': false,
            },
          },
          'postcss-flexbugs-fixes': {},
          'postcss-sort-media-queries': {},
          cssnano: {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
                normalizeWhitespace: false,
              },
            ],
          },
        }
      : {}),
  },
} 