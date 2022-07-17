const navSite = document.querySelector('.site-nav');
const navToggle = document.querySelector('.page-header__nav-toggle');

navSite.classList.remove('site-nav--nojs');
navToggle.classList.remove('page-header__nav-toggle--nojs');

navToggle.addEventListener('click', function () {
  if (navSite.classList.contains('site-nav--closed')) {
    navSite.classList.remove('site-nav--closed');
    navSite.classList.add('site-nav--opened');
    navToggle.classList.remove('page-header__nav-toggle--closed');
    navToggle.classList.add('page-header__nav-toggle--opened');
  } else {
    navSite.classList.add('site-nav--closed');
    navSite.classList.remove('site-nav--opened');
    navToggle.classList.add('page-header__nav-toggle--closed');
    navToggle.classList.remove('page-header__nav-toggle--opened');
  }
});
