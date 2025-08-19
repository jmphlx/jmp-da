// damservlet.ts
import { request } from '@playwright/test';

async function run() {
  const context = await request.newContext();
  const url = 'https://www.jmp.com/services/damservlet?path=/content/dam/devtest/Test-PDFs';

  const response = await context.get(url);

  if (!response.ok()) {
    console.error(`❌ Failed to fetch data. Status: ${response.status()}`);
    process.exit(1);
  }

  const json = await response.json();

  //console.log('Full JSON response received.\n');
  //console.log(JSON.stringify(json, null, 2));

 
  if (Array.isArray(json)) {
    json.forEach((item, index) => {
      const title = item?.title ?? 'N/A';
      const path = item?.path ?? 'N/A';
      console.log(`Asset #${index + 1}:`);
      console.log(`  Title: ${title}`);
      console.log(`  Path:  ${path}\n`);
    });
  } else {
    console.error('Expected an array in the JSON response but got:', typeof json);
    console.log('Response:', JSON.stringify(json, null, 2));
  }

  await context.dispose();
}

run();
