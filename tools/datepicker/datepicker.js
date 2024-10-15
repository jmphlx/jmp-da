// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

export function initTimeZones(doc = document) {
  const select = doc.getElementById('time-zone');

  let defTZ = '';
  const curTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezonesWithoffsets = Intl.supportedValuesOf('timeZone').map((timeZone) => {
    let offset = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'longOffset' })
      .formatToParts().find((part) => part.type === 'timeZoneName').value;
    if (offset === 'GMT') {
      offset = 'GMT+00:00';
    }
    const timeZoneAbbrivation = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'long' })
      .formatToParts().find((part) => part.type === 'timeZoneName').value;
    const tz = `(${offset}) ${timeZoneAbbrivation}`;
    if (timeZone === curTZ) {
      defTZ = tz;
    }
    return tz;
  });
  const tzSet = Array.from(new Set(timezonesWithoffsets)).sort();

  tzSet.forEach((tz) => {
    const opt = doc.createElement('option');
    opt.textContent = tz;

    const delta = tz.substring(4, tz.indexOf(')'));
    opt.value = delta;

    if (tz === defTZ) {
      opt.selected = true;
    }

    select.appendChild(opt);
  });
}

function typeChange(e) {
  let hasDate = false;
  let hasTime = false;
  switch (e.target.value) {
    case 'date':
      hasDate = true;
      break;
    case 'time':
      hasTime = true;
      break;
    default:
      hasDate = true;
      hasTime = true;
      break;
  }
  document.querySelectorAll('form#picker input[type=date]').forEach((date) => {
    date.hidden = !hasDate;
    date.required = hasDate;
  });
  document.querySelectorAll('form#picker [name=time-picker]').forEach((time) => {
    time.hidden = !hasTime;
    time.required = hasTime;
  });
}

export function useButtonClicked(e, actions, doc = document) {
  e.preventDefault();

  const form = doc.querySelector('form#picker');
  if (!form.reportValidity()) {
    return;
  }

  const inputType = doc.querySelector('form#typeselect input[name="date-picker"]:checked').value;
  let seldate = '';
  if (inputType.includes('date')) {
    seldate = doc.querySelector('form#picker input[type=date]').value;
  }

  let seltime = '';
  let seltz = '';
  if (inputType.includes('time')) {
    seltime = doc.querySelector('form#picker input[type=time]').value;
    seltz = doc.querySelector('form#picker select#time-zone').value;
  } else {
    actions.sendText(seldate);
    actions.closeLibrary();
    return;
  }

  const d = new Date(`${seldate}T${seltime}${seltz}`);

  const result = d.toISOString();
  const cIdx = result.lastIndexOf(':');
  const result2 = result.substring(0, cIdx);
  const result3 = result2.replace('T', ' ');
  const result4 = `${result3}Z`;

  actions.sendText(result4);
  actions.closeLibrary();
}

function initControls(actions) {
  document.querySelectorAll('form#typeselect input[type=radio]').forEach((radio) => {
    radio.addEventListener('change', typeChange);
  });

  document.querySelectorAll('button#use').forEach((button) => {
    button.onclick = (e) => useButtonClicked(e, actions);
  });
}

(async function init() {
  const { actions } = await DA_SDK;

  initControls(actions);
  initTimeZones();
}());
