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
    const inputString = response.choices[0].message.content.toString();
    //simulateTyping(inputString, ans);
    ans.value = response.choices[0].message.content.toString();
  }
});

function simulateTyping(inputString, targetElement) {
  // Set focus on the target element
  targetElement.focus();

  // Iterate through each character of the input string
  for (let i = 0; i < inputString.length; i++) {
    // Get the character at the current index
    const char = inputString.charAt(i);

    // Create a keydown event for the current character
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: char,
      keyCode: char.charCodeAt(0),
      code: `Key${char.toUpperCase()}`,
      which: char.charCodeAt(0),
      bubbles: true,
      cancelable: true,
    });

    // Dispatch the keydown event
    targetElement.dispatchEvent(keyDownEvent);

    // Create a keyup event for the current character
    const keyUpEvent = new KeyboardEvent('keyup', {
      key: char,
      keyCode: char.charCodeAt(0),
      code: `Key${char.toUpperCase()}`,
      which: char.charCodeAt(0),
      bubbles: true,
      cancelable: true,
    });

    // Dispatch the keyup event
    targetElement.dispatchEvent(keyUpEvent);
  }
}
