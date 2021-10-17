// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const gulp = require('gulp');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const eslint = require('gulp-eslint');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const rollup = require('rollup');
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const rollupTypescript = require('@rollup/plugin-typescript');

async function* walk(dir) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}

gulp.task('build', async (done) => {
  // TODO: Look into bundling web page with rollup
  // TODO: allow require
  // Make List of all files in the output foreground folder
  const files = [];
  for await (const p of walk('./dist/Foreground/')) {
    const pathList = p.split(path.sep);
    pathList.shift();
    files.push(pathList.join('/'));
  }
  // Copy Manifest
  const manifest = JSON.parse(
    await fs.promises.readFile('./src/manifest.json', 'utf8')
  );
  if (manifest['web_accessible_resources'])
    manifest['web_accessible_resources'].push(...files);
  else manifest['web_accessible_resources'] = files;
  await fs.promises.writeFile(
    './dist/manifest.json',
    JSON.stringify(manifest, null, 2)
  );
  // generate our Background Script
  const a = await rollup.rollup({
    input: './src/Background/Background.ts',
    plugins: [
      rollupTypescript({
        cacheDir: './dist/cache/',
      }),
    ],
  });
  await a.write({
    file: './dist/Background/Background.js',
    name: 'Background',
    format: 'iife',
    compact: true,
    indent: '  ',
    preferConst: true,
  });
  const b = await rollup.rollup({
    input: './src/Background/Content.ts',
    plugins: [
      rollupTypescript({
        cacheDir: './dist/cache/',
      }),
    ],
  });
  await b.write({
    file: './dist/Background/Content.js',
    name: 'Content',
    format: 'iife',
    compact: true,
    indent: '  ',
    preferConst: true,
  });
  done();
  // eslint-disable-next-line no-undef
  process.exit(0);
});

gulp.task('lint', () => {
  return (
    gulp
      .src(['src/**/*.{js,ts,tsx}'])
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
