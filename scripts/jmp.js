import {
  getJsonFromUrl
} from '/scripts/aem.js';

async function getTimezones() {
  const timezones = await getJsonFromUrl('/scripts/moment/timezones.json');
  return timezones;
}

function getTimezoneObjectFromAbbr(timezones, tzabbr) {
  const timezone = timezones.filter((item) => {
   return item.abbr === tzabbr;
  });
  console.log(timezone);
  return timezone[0];
}

export {
  getTimezoneObjectFromAbbr,
  getTimezones
};
