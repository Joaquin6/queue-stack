($ => {
  function makePaginated(elem, opts) {
    const defaults = {
      activeColor: 'blue',
      perPage: 10,
      showPrevious: true,
      showPreviousText: '',
      showNext: true,
      showNextText: '',
      hidePageNumbers: false,
      childSelector: '',
      paginatorSelector: '.paginator',
    };

    const $this = $(elem);
    const options = $.extend({}, defaults, opts);

    const tableBody = $this.find('tbody');

    let rows;
    if (options.childSelector) {
      rows = tableBody.find(options.childSelector);
    } else {
      rows = tableBody.children();
    }

    let paginator = $(options.paginatorSelector);
    if (!paginator.length) {
      paginator = $('<ul class="pagination paginator"></ul>');
      // Add the paginator _after_ the <table> element to avoid inserting it unnecessarily
      // as an element _in_ the table.
      $this.after(paginator);
    }

    const numItems = rows.length;
    const { perPage } = options;
    const numPages = Math.ceil(numItems / perPage);

    const activePageClasses = `active ${options.activeColor}`;

    function goTo(page) {
      const start = page * perPage;
      const end = start + perPage;

      rows.hide().slice(start, end).show();

      if (page >= 1 && options.showPrevious) {
        $('.pg-previous-page', paginator).removeClass('disabled');
      } else if (options.showPrevious) {
        $('.pg-previous-page', paginator).addClass('disabled');
      }

      if (page < (numPages - 1)) {
        $('.pg-next-page', paginator).removeClass('disabled');
      } else if (options.showPrevious) {
        $('.pg-next-page', paginator).addClass('disabled');
      }

      paginator.data('current-page', page);
      const pages = $('.pg-page', paginator);
      pages.removeClass(activePageClasses);
      pages.eq(page).addClass(activePageClasses);
    }

    function next() {
      const nextPage = parseInt(paginator.data('current-page'), 10) + 1;
      if (nextPage < numPages) {
        goTo(nextPage);
      }
    }

    function previous() {
      const previousPage = parseInt(paginator.data('current-page'), 10) - 1;
      if (previousPage >= 0) {
        goTo(previousPage);
      }
    }

    if (options.showPrevious) {
      const prevPageElement = $('<li class="waves-effect disabled pg-previous-page"></li>');
      const prevPageLink = $(`<a href="#" title="${options.showPreviousText}"><i class="material-icons">chevron_left</i></a>`);
      prevPageLink.click(() => {
        previous();
        return false;
      });
      prevPageLink.appendTo(prevPageElement);
      prevPageElement.appendTo(paginator);
    }

    if (!options.hidePageNumbers) {
      for (let i = 0; i < numPages; i += 1) {
        const pageElement = $(`<li class="waves-effect pg-page ${i === 0 ? activePageClasses : ''}"></li>`);
        const pageLink = $(`<a href="#">${i + 1}</a>`);
        pageLink.click(((index) => () => {
          goTo(index);
          return false;
        })(i));
        pageLink.appendTo(pageElement);
        pageElement.appendTo(paginator);
      }
    }

    if (options.showNext) {
      const nextPageElement = $(`<li class="waves-effect ${numPages > 1 ? '' : 'disabled'} pg-next-page"></li>`);
      const nextPageLink = $(`<a href="#" title="${options.showNextText}"><i class="material-icons">chevron_right</i></a>`);
      nextPageLink.click(() => {
        next();
        return false;
      });
      nextPageLink.appendTo(nextPageElement);
      nextPageElement.appendTo(paginator);
    }

    paginator.data('current-page', 0);
    rows.hide().slice(0, perPage).show();
  }

  $.fn.paginate = function paginate(options) {
    return this.each(function each() {
      return makePaginated(this, options);
    });
  };
})(jQuery, window, document); // eslint-disable-line no-undef
