/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
let reloading;
const objQueryString = {};
const terminalStates = ['success', 'failed', 'timeout', 'aborted'];

// Get querystring value
function getParameterByName(name) {
  const sanitizedName = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${sanitizedName}=([^&#]*)`);

  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Add or modify querystring
function changeUrl(key, value) {
  // Get query string value
  const searchUrl = location.search;
  let urlValue;

  if (searchUrl.indexOf('?') === -1) {
    urlValue = `?${key}=${value}`;
    history.pushState({ state: 1, rand: Math.random() }, '', urlValue);
  } else {
    // Check for key in query string, if not present
    if (searchUrl.indexOf(key) === -1) {
      urlValue = `${searchUrl}&${key}=${value}`;
    // If key present in query string
    } else {
      oldValue = getParameterByName(key);
      if (searchUrl.indexOf(`?${key}=`) !== -1) {
        urlValue = searchUrl.replace(`?${key}=${oldValue}`, `?${key}=${value}`);
      } else {
        urlValue = searchUrl.replace(`&${key}=${oldValue}`, `&${key}=${value}`);
      }
    }
    history.pushState({ state: 1, rand: Math.random() }, '', urlValue);
    // history.pushState function is used to add history state.
    // It takes three parameters: a state object, a title
    // (which is currently ignored), and (optionally) a URL.
  }
  objQueryString.key = value;
}

// Function used to remove querystring
function removeQString(key) {
  let urlValue = document.location.href;

  // Get query string value
  let searchUrl = location.search;

  if (key !== '') {
    oldValue = getParameterByName(key);
    removeVal = `${key}=${oldValue}`;
    if (searchUrl.indexOf(`?${removeVal}&`) !== -1) {
      urlValue = urlValue.replace(`?${removeVal}&`, '?');
    } else if (searchUrl.indexOf(`&${removeVal}&`) !== -1) {
      urlValue = urlValue.replace(`&${removeVal}&`, '&');
    } else if (searchUrl.indexOf(`?${removeVal}`) !== -1) {
      urlValue = urlValue.replace(`?${removeVal}`, '');
    } else if (searchUrl.indexOf(`&${removeVal}`) !== -1) {
      urlValue = urlValue.replace(`&${removeVal}`, '');
    }
  } else {
    searchUrl = location.search;
    urlValue = urlValue.replace(searchUrl, '');
  }
  history.pushState({ state: 1, rand: Math.random() }, '', urlValue);
}

function toNumber(val) {
  if (typeof val === 'number') {
    return val;
  }
  const num = val.replace(/\d+$/, '');
  if (!num.length) {
    return 0;
  }
  return parseInt(num, 10);
}

function isNumeric(val) {
  return !isNaN(parseFloat(val)) && isFinite(val);
}

function checkFrequencyValue(val = 30) {
  const seconds = isNumeric(val) ? val : toNumber(val);
  if (seconds < 5 || seconds > 60) {
    return false;
  }
  return seconds;
}

function checkReloading() {
  const { search } = window.location;

  if (search.includes('?autoreload')) {
    const $JobStatusStateEl = $('#job-status-state');
    const $AutoReloadFreqEl = $('#auto-reload-frequency');

    const taskState = $JobStatusStateEl.text();
    const seconds = checkFrequencyValue(search.split('=')[1] || $AutoReloadFreqEl.val());
    const frequency = seconds * 1000;

    reloading = setTimeout(() => {
      window.location.reload();
      $AutoReloadFreqEl.val(seconds);
    }, frequency);

    if (terminalStates.includes(taskState)) {
      clearTimeout(reloading);
      removeQString('autoreload');
    }
  }
}

function replaceAutoreloadQuery(seconds) {
  window.location.replace(`?autoreload=${seconds}`);
}
/* eslint-disable-next-line no-unused-vars */
function toggleAutoRefresh(checkbox) {
  const $ManualReloadButton = $('#manual-refresh');
  const $AutoReloadEl = $('#auto-reload');
  const $AutoReloadFreqEl = $('#auto-reload-frequency');
  const seconds = checkFrequencyValue($AutoReloadFreqEl.val());

  // Weirdly, this is to check if the checkbox WAS JUST checked.
  // Seems like materialize handles the checking right before this event
  if (checkbox.checked) {
    const frequency = seconds * 1000;

    changeUrl('autoreload', seconds);

    $AutoReloadEl.attr('checked', 'checked');
    $AutoReloadFreqEl.removeAttr('disabled');

    reloading = setTimeout(() => {
      window.location.reload();
    }, frequency);
  } else {
    clearTimeout(reloading);
    $(checkbox).removeAttr('checked');
    $AutoReloadFreqEl.attr('disabled', 'disabled');
    $ManualReloadButton.removeAttr('disabled');
    removeQString('');
  }
}

function toggleDisabled() {
  return this.each(function each() {
    const $this = $(this);
    if ($this.attr('disabled')) {
      $this.removeAttr('disabled');
    } else {
      $this.attr('disabled', 'disabled');
    }
  });
}

window.onload = checkReloading;
$.fn.toggleDisabled = toggleDisabled;

$(() => {
  $('select').formSelect();
  $('.tooltipped').tooltip();

  $('.collapsible').collapsible({
    accordion: false,
    inDuration: 500,
    outDuration: 500,
    onCloseEnd: function onCloseEnd(el) {
      $(el).find('.collapsible-header').text('Show more');
      $(el).find('.collapsible-header').append('<i class="material-icons">arrow_drop_down</i>');
    },
    onOpenEnd: function onOpenEnd(el) {
      $(el).find('.collapsible-header').text('Show less');
      $(el).find('.collapsible-header').append('<i class="material-icons">arrow_drop_up</i>');
    },
  });

  $('.dropdown-trigger').dropdown({
    hover: false,
    coverTrigger: false,
  });

  $('.floatThead-table').floatThead({
    position: 'auto',
    scrollContainer: true,
  });

  $('#auto-reload-frequency').focusout(function focusout() {
    replaceAutoreloadQuery($(this).val());
    checkReloading();
  });

  // Taken from https://stackoverflow.com/a/40124502. Materialize uses a jquery plugin to validate
  // forms and it appears this plugin will not validate hidden elements ('display: none'), which
  // the selects that materialize generates have by default. This workaround allows the validation
  // tooltip to show up when no option is selected, giving the user valuable feedback on why the
  // form can't be submitted.
  $('select[required]').css({ display: 'block', height: 0, padding: 0, width: 0, position: 'absolute' });
});
