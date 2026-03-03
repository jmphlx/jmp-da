import {
  getPageStatus,
  getPublishStatus,
  createRateLimiter,
} from '../../scripts/helper.js';

/**
 * https://admin.hlx.page/ only supports 10 requests per second, but need to space it out to 3 seconds.
*/
const rateLimit = createRateLimiter(10, 3000);
let token;

export function setToken(tokenVal) {
  token = tokenVal;
}

function cleanPagePath(itemPath) {
  let cleanItemPath = itemPath;
  cleanItemPath = cleanItemPath.startsWith('/') ? cleanItemPath.substring(1) : cleanItemPath;
  cleanItemPath = cleanItemPath.indexOf('.html') > 0 ? cleanItemPath : `${cleanItemPath}.html`;
  return cleanItemPath;
}

function updateResultItem(resultItem, publishStatus) {
  const statusIcon = resultItem.querySelector('div.statusCircle');
  statusIcon.classList.remove('status-loading');
  statusIcon.classList.add(`status-${publishStatus}`);
}

export async function getPublishStatusObj(path) {
  return rateLimit(() => getPageStatus(path, token));
}

export async function updatePublishStatus(item, resultItem) {
  if (!token) {
    return;
  }
  const pagePath = cleanPagePath(item.pagePath);
  const pageStatusObj = await getPublishStatusObj(pagePath, token);
  const publishStatus = getPublishStatus(pageStatusObj);
  updateResultItem(resultItem, publishStatus);
}
