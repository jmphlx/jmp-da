async function getConfig(configType) {
  const importConfig = await import(`../configurations/${configType}`);
  console.log(JSON.stringify(importConfig));
  return JSON.stringify(importConfig);
}


export default async function sendPostRequest(authToken, configType) {
  const url = `https://admin.hlx.page/config/jmphlx/sites/jmp-da/content/${configType}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${authToken}`,
        'Accept': '*/*',
        'Content-Type': 'text/yaml',
      }, 
      body: getConfig(configType),
    });

    if (!response.ok) return null;
    console.log(response);
    const json = await response.json();
    console.log(json);
    return json;

  } catch (error) {
    console.error('post request: ', { error });
  }
  return null;
}
