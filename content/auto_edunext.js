async function getTxt(){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const question = document.getElementsByClassName("styled");
      const querry = question[0].innerText.toString().replace(/[\r\n]/gm, ' ');
      for(let i = 0; i < document.getElementsByClassName("css-1id89ip").length;i++)
      {
        if(document.getElementsByClassName("css-1id89ip")[i].innerText.toUpperCase().includes("DISCUSS"))
        {
          console.log(document.getElementsByClassName("css-1id89ip")[i])
          document.getElementsByClassName("css-1id89ip")[i].click();
        }
      }
      resolve(querry);
    }, 700);
  });
}

async function promptChatGPT(promptText, api) {
  const modelName = 'gpt-3.5-turbo'; // Specify the model name here
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api}`
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role:"user",
          content: promptText
        }
      ],
      max_tokens: 300, // Maximum number of tokens (words) the model should return
      temperature: 0.8, // Controls the randomness of the output
      stop: '\n', // Stops generation at a specific token
    })
  };
  
  return fetch('https://api.openai.com/v1/chat/completions', requestOptions)
    .then(response => response.json())
    .catch(error => {
      console.error('Error:', error);
      return null;
    });
}

// Example usage
const main = async () => {
  const api = await getFromStorage('API_KEY', '');
  const prompt = await getTxt();
  const response = await promptChatGPT(prompt, api);
  return response;
}

main().then(response => {
  const ans = document.getElementsByClassName("w-md-editor-text-input")[0];
  
  ans.addEventListener("click", function (e) {e.preventDefault();});
  if (response && response.choices && response.choices.length > 0) {
    navigator.clipboard.writeText(response.choices[0].message.content.toString());
    ans.focus();
    ans.select();
    ans.value = response.choices[0].message.content.toString();
    //ans.value = "Lorem ipsum dolor sit amet, consectetur"
  }
});


