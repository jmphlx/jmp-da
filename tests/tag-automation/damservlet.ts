// damservlet.ts
import { request } from '@playwright/test';

async function run() {
  const context = await request.newContext();
  const url = 'https://www.jmp.com/services/damservlet?path=/content/dam/devtest/Test-PDFs';

  const response = await context.get(url);

  if (!response.ok()) {
    console.error(`Failed to fetch data. Status: ${response.status()}`);
    process.exit(1);
  }

  const json = await response.json();

  
  console.log('Full JSON response:\n');
  console.log(JSON.stringify(json, null, 2)); 

  await context.dispose();
}

run();
