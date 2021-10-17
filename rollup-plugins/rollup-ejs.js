import { compile } from 'ejs';
import fs from 'fs';
import path from 'path';
import sass from 'node-sass';
import { minify } from 'html-minifier';

const linkTagRegEx =
  /<link(?=.*\shref=['|"]([\w$-_.+!*'(),]*)['|"])(?=.*\srel=['|"]stylesheet['|"]).*>/g;
const readStyleFile = (tplFilePath, href) =>
  fs.readFileSync(path.resolve(path.parse(tplFilePath).dir, href), 'utf8');
const defaultCompilerOptions = {
  client: true,
  strict: true,
  compileDebug: false,
};

const compilers = {
  css: readStyleFile,
  scss: (tplFilePath, href) => {
    const compiled = sass.renderSync({
      data: readStyleFile(tplFilePath, href),
      importer: (url, prev) => ({
        file: path.resolve(
          path.parse(prev === 'stdin' ? tplFilePath : prev).dir,
          url
        ),
      }),
    });

    return compiled.css.toString('utf8');
  },
};

const loadStylesTo = (code, tplFilePath) =>
  code.replace(linkTagRegEx, (match, href) =>
    href && path.extname(href)
      ? `<style>${compilers[path.extname(href).substr(1)](
          tplFilePath,
          href
        )}</style>`
      : `<link href="${href}" rel="stylesheet" type="text/css">`
  );

const renderCode = (templateFn, render) => {
  if (render) {
    const { data, minifierOptions } = render;

    return JSON.stringify(
      minifierOptions
        ? minify(templateFn(data), minifierOptions)
        : templateFn(data)
    );
  }

  return templateFn.toString();
};

const index = ({
  include,
  loadStyles,
  render,
  compilerOptions = defaultCompilerOptions,
} = {}) => {
  return {
    name: 'ejs',
    transform: function transform(code, tplFilePath) {
      if (include.some((e) => e.test(tplFilePath))) {
        const codeToCompile = loadStyles
          ? loadStylesTo(code, tplFilePath)
          : code;
        const templateFn = compile(
          codeToCompile,
          Object.assign(defaultCompilerOptions, compilerOptions)
        );

        return {
          code: `export default ${renderCode(templateFn, render)};`,
          map: { mappings: '' },
        };
      }
    },
  };
};

export default index;
