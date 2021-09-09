// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const gulp = require('gulp');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const eslint = require('gulp-eslint');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const rollup = require('rollup');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const rollupTypescript = require('@rollup/plugin-typescript');

gulp.task('build', async (done) => {
  // Copy Manifest
  await fs.promises.copyFile('./src/manifest.json', './dist/manifest.json');
  // TODO: Modify Manifest Add All Code For WebPage
  // TODO: Look into bundling web page with rollup
  // generate our Background Script
  const bundle = await rollup.rollup({
    input: './src/Background/Background.ts',
    plugins: [
      rollupTypescript({
        cacheDir: './dist/cache/'
      })
    ]
  });
  await bundle.write({
    file: './dist/Background/Background.js',
    name: 'Background',
    format: 'iife',
    compact: true,
    indent: '  ',
    preferConst: true
  });
  done();
  // eslint-disable-next-line no-undef
  process.exit(0);
});

gulp.task('lint', () => {
  return gulp.src(['src/**/*.{js,ts}'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});