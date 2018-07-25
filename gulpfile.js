var gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var pump = require('pump')

gulp.task('minify-css', () => {
    return gulp.src('styles/*.css')
        .pipe(cleanCSS({debug: true}, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        .pipe(autoprefixer({
            browsers:['last 2 versions']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('compress', function (cb) {
    pump([
          gulp.src('lib/*.js'),
          uglify(),
          gulp.dest('dist')
      ],
      cb
    );
});

gulp.task('copy-html', function () {
    return gulp.src('./index.html')
        .pipe(gulp.dest('./dist'));
});