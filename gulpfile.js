import gulp from 'gulp';
import eslint from 'gulp-eslint';
import * as rollup from 'rollup';
import { terser } from 'rollup-plugin-terser';
import ejs from './rollup-plugins/rollup-ejs.js';
import fs from 'fs';
// Options
const terserOptions = {
  compress: {
    passes: 3,
    module: true,
  },
  format: {
    beautify: true,
    // max_line_len: 500,
    quote_style: 1, //Always Single
    indent_level: 2,
  },
};
// Generate
gulp.task('build', async () => {
  const bundle = await rollup.rollup({
    input: 'src/js/main.js',
    plugins: [
      ejs({
        include: [/[^\\]*\.ejs$/],
        compilerOptions: { client: true },
        loadStyles: true,
      }),
      terser(terserOptions),
    ],
  });
  // Get All Assets For Build
  const manifest = JSON.parse(
    await fs.promises.readFile('./src/manifest.json', 'utf8')
  );
  await fs.promises.writeFile(
    './dist/manifest.json',
    JSON.stringify(manifest, 2, 2)
  );
  // Bundle Google Picker Library
  await fs.promises.copyFile('./src/js/libs/client.js', './dist/client.js');
  // Read Build Size Stuff
  const oldCode = fs.existsSync('./dist/main.js')
    ? await fs.promises.readFile('./dist/main.js', 'utf-8')
    : '';
  const previousStats = {
    chars: oldCode.length,
    lines: oldCode.split('\n').length,
    blanks: oldCode.split('\n').filter((n) => n.trim() == '').length,
    comments: oldCode.split('\n').filter((n) => n.trim().startsWith('//'))
      .length,
  };
  // Output
  await bundle.write({
    file: 'dist/main.js',
    format: 'iife',
  });
  const code = fs.existsSync('./dist/main.js')
    ? await fs.promises.readFile('./dist/main.js', 'utf-8')
    : '';
  // Size Stuff
  const stats = {
    chars: code.length,
    lines: code.split('\n').length,
    blanks: code.split('\n').filter((n) => n.trim() == '').length,
    comments: code.split('\n').filter((n) => n.trim().startsWith('//')).length,
  };
  console.table({
    previous: {
      ...previousStats,
      code: previousStats.lines - previousStats.blanks - previousStats.comments,
    },
    current: {
      ...stats,
      code: stats.lines - stats.blanks - stats.comments,
    },
    reduction: {
      chars: previousStats.chars - code.length,
      lines: previousStats.lines - code.split('\n').length,
      blanks:
        previousStats.blanks -
        code.split('\n').filter((n) => n.trim() == '').length,
      comments:
        previousStats.comments -
        code.split('\n').filter((n) => n.trim().startsWith('//')).length,
      code:
        previousStats.lines -
        previousStats.blanks -
        previousStats.comments -
        (stats.lines - stats.blanks - stats.comments),
    },
  });
});

gulp.task('lint', () => {
  return (
    gulp
      .src(['src/**/*.{js,ts}'])
      // eslint() attaches the lint output to the "eslint" property
      // of the file object so it can be used by other modules.
      .pipe(eslint())
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failAfterError last.
      .pipe(eslint.failAfterError())
  );
});
