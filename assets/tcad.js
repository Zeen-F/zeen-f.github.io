/* Native anchors honor the article's scroll margin below the sticky masthead. */
if (window.jQuery) {
  window.jQuery(() => {
    window.jQuery('body[data-page="tcad"] a[href^="#"]').off('click.smoothscroll');
  });
}
