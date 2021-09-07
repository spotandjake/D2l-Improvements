import gulp from "gulp";
import eslint from 'gulp-eslint';
import * as rollup from "rollup";
import { terser } from 'rollup-plugin-terser';
import ejs from "./rollup-plugins/rollup-ejs.js";
import fs from "fs";
import path from "path";
// Options
const terserOptions = {
  compress: {
    passes: 3,
    module: true
  },
  format: {
    beautify: true,
    // max_line_len: 500,
    quote_style: 1, //Always Single
    indent_level: 2
  }
};
// Generate
gulp.task("build", async () => {
  const bundle = await rollup.rollup({
    input: "src/js/main.js",
    plugins: [
      ejs({
        include: [/[^\\]*\.ejs$/],
        compilerOptions: { client: true },
        loadStyles: true
      }),
      terser(terserOptions),
    ],
  });
  // Get All Assets For Build
  const { code } = (
    await bundle.generate({
      file: "dist/main.js",
      format: "iife",
    })
  ).output[0];
  const matches = code.match(/chrome\.runtime\.getURL\((?<param>[^)]*)\)/g);
  const assets = matches ? matches
    .map((m) => {
      const match = m.match(/chrome\.runtime\.getURL\((?<param>[^)]*)\)/);
      if (match) {
        const fileName = match.groups.param.replace(/['"]/g, "");
        const folder = path.dirname(`./dist/${fileName}`);
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        fs.copyFileSync(
          path.resolve(`./src/${fileName}`),
          path.resolve(`./dist/${fileName}`)
        );
        return fileName.replace(/^\.\//, '');
      } else return null;
    })
    .filter((n) => n) : [];
  const manifest = JSON.parse(
    await fs.promises.readFile("./src/manifest.json", "utf8")
  );
  manifest.web_accessible_resources = assets;
  await fs.promises.writeFile("./dist/manifest.json", JSON.stringify(manifest, 2, 2));
  // Bundle Blocker
  const bundleBlocker = await rollup.rollup({
    input: "src/js/blocker.js",
    plugins: [
      terser(terserOptions),
    ],
  });
  bundleBlocker.write({
    file: "dist/blocker.js",
    format: "iife",
  });
  // Output
  return bundle.write({
    file: "dist/main.js",
    format: "iife",
  });
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