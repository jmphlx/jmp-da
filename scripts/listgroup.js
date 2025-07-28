import {
  getLanguage,
  getJsonFromUrl,
 } from './jmp.js';

async function getEmptyResultsMessage(emptyResultString) {
  if (!emptyResultString) {
    return undefined;
  }

  if (emptyResultString.includes('.json')) {
    const pageLanguage = getLanguage();
    const data = await getJsonFromUrl(emptyResultString);
    const { data: translations } = data[pageLanguage];
    console.log(translations[0]);
    return translations[0].emptyResultsMessage;
  } else {
    // use the string as the empty results message. It won't translate.
    return emptyResultString;
  }
}

export {
  getEmptyResultsMessage,
};
