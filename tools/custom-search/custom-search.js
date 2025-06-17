import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { crawl } from 'https://da.live/nx/public/utils/tree.js';

const daRepoUrl = 'https://da.live/#/jmphlx/jmp-dev';
const basePath = '/jmphlx/jmp-dev';




async function init() {
  const { context, token, actions } = await DA_SDK;

  console.log('hi');
  const searchResultsContainer = document.getElementById('search-results');
  const path = '/en/customer-stories';

  const searchpath = `${basePath}${path}`;
  console.log(searchpath);

  function getPages(context, token) {
    const files = [];
    const callback = (file) => {
      if (file.path.endsWith('.html')) {
        files.push(file);
      }
    };

    // const path = `/${context.org}/${context.repo}${FRAGMENTS_BASE}`;
    // const basePath = `/${context.org}/${context.repo}`;
    const opts = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const path = '/jmphlx/jmp-dev/en/customer-stories';

    const { results } = crawl({
      path,
      callback,
      throttle: 10,
      ...opts,
    });

    return results;
  }

  const results = await getPages(context, token);

  const resultsElement = document.createElement('span');
  resultsElement.textContent = results;
  // resultsElement.textContent = 'here';
  searchResultsContainer.append(resultsElement);
}

init();