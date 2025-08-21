import {
  getLanguage,
  getJsonFromUrl,
  isTagProperty,
} from './jmp.js';

const tagTranslationsBaseURL = 'https://www.jmp.com/services/tagsservlet';

async function getTagTranslations() {
  const pageLanguage = getLanguage();
  window.tagtranslations = window.tagtranslations || await getJsonFromUrl(`${tagTranslationsBaseURL}.${pageLanguage}`);
}

async function getEmptyResultsMessage(emptyResultString) {
  if (!emptyResultString) {
    return undefined;
  }

  if (emptyResultString.includes('.json')) {
    const pageLanguage = getLanguage();
    const data = await getJsonFromUrl(emptyResultString);
    const { data: translations } = data[pageLanguage];
    return translations[0].emptyResultsMessage;
  }
  // otherwise use the string as the empty results message. It won't translate.
  return emptyResultString;
}

function checkForTagProperties(displayProperties) {
  let tagFound = false;
  for (let i = 0; i < displayProperties.length; i++) {
    if (isTagProperty(displayProperties[i])) {
      tagFound = true;
      break;
    }
  }
  return tagFound;
}

export {
  checkForTagProperties,
  getEmptyResultsMessage,
  getTagTranslations,
};
