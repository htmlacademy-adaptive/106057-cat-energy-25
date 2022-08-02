import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import { deleteAsync } from 'del';
import gulp from 'gulp';
import cheerio from 'gulp-cheerio';
import csso from 'postcss-csso';
import imagemin from 'gulp-imagemin';
import less from 'gulp-less';
import mozjpeg from 'imagemin-mozjpeg';
import optipng from 'imagemin-optipng';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import svgo from 'imagemin-svgo';
import svgstore from 'gulp-svgstore';
import terser from 'gulp-terser';
import webp from 'gulp-webp';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Copy files

const copyFiles = () => {
  return gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico',
  'source/*.html'
  ], {base: 'source'})
    .pipe(gulp.dest('build'));
}

// JS

const minJS = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(rename(function (path) {
      path.basename += "-min";
    }))
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
}

// Images

const imagesOpti = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}')
    .pipe(imagemin([
      mozjpeg({quality: 90, progressive: true}),
	    optipng({optimizationLevel: 2}),
      svgo()
    ]))
    .pipe(gulp.dest('build/img'));
}

const createWebp = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicons/**'])
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src([
  'source/img/**/*.{jpg,png,svg}',
  ], {base: 'source'})
    .pipe(gulp.dest('build'));
}

// Sprite svg

const spriteSvg = () => {
  return gulp.src(['source/img/icons/icon-email.svg', 'source/img/icons/icon-phone.svg', 'source/img/logo-htmlacademy.svg'])
  .pipe(cheerio({
    run: ($) => {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
    }
}))
  .pipe(svgstore())
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

// Clean

const clean = () => {
  return deleteAsync('build');
};

// Server

const server = (done) => {
  browser.init({
    server: {
    baseDir: 'build'
  },
    cors: true,
    notify: false,
    ui: false,
  });
    done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(minJS));
  gulp.watch('source/*.html').on('change', browser.reload);
}

// Build

export const build = gulp.series(
    clean,
  gulp.parallel(
    copyFiles,
    styles,
    minJS,
    imagesOpti,
    createWebp,
    spriteSvg
  )
);


export default gulp.series(
  clean,
  copyImages,
  gulp.parallel(
    copyFiles,
    styles,
    minJS,
    createWebp,
    spriteSvg
  ),
  gulp.series(
    server,
    watcher
  )
);
