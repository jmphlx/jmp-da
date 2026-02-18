import fs from 'node:fs/promises';

export default async function sendPostRequest(authToken, yamlText, configType) {
  const url = `https://admin.hlx.page/config/jmphlx/sites/jmp-da/content/${configType}`;

  console.log('pre posssttt');
  console.log(url);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${authToken}`,
        'Accept': '*/*',
        'Content-Type': 'text/yaml',
      }, 
      body: yamlText,
    });
    console.log('response');
    console.log(response);

    if (!response.ok) return null;
    console.log('here');
    console.log(response);
    const json = await response.json();
    console.log(json);
    return json;

  } catch (error) {
    console.log('found an error');
    console.error('post request: ', { error });
  }
}

const authToken = process.env.AUTH_TOKEN;
const configPath = process.env.CONFIG_PATH;
const configName = process.env.CONFIG_NAME;

console.log('prePOST');

const yamlText = await fs.readFile(configPath, 'utf8');

console.log('---- FULL FILE START ----');
console.log(yamlText);
console.log('---- FULL FILE END ----');

const result = await sendPostRequest(authToken, yamlText, configName);
console.log('result here');
console.log(result);
