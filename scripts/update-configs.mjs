import fs from 'node:fs/promises';

export default async function sendPostRequest(authToken, yamlText, configType) {
  const url = `https://admin.hlx.page/config/jmphlx/sites/jmp-da/content/${configType}`;

  console.log('pre posssttt');
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
  return null;
}

const authToken = process.env.AUTH_TOKEN;
const configPath = process.env.CONFIG_PATH;
const configName = process.env.CONFIG_NAME;

console.log('prePOST');

const yamlText = await fs.readFile(configPath);

const result = await sendPostRequest(authToken, yamlText, configName);
console.log('result here');
console.log(result);
