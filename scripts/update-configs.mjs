
export default async function sendPostRequest(authToken, configPath, configType) {
  const url = `https://admin.hlx.page/config/jmphlx/sites/jmp-da/content/${configType}`;

  try {
    const yamlResponse = await fetch(configPath);
    const responseText= yamlResponse.text();
    console.log(responseText);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${authToken}`,
        'Accept': '*/*',
        'Content-Type': 'text/yaml',
      }, 
      body: responseText,
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
