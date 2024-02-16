var content;
async function getTxt() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for(let i = 0; i < document.getElementsByClassName("css-1id89ip").length;i++)
      {
        if(document.getElementsByClassName("css-1id89ip")[i].innerText.toUpperCase().includes("DISCUSS"))
        {
          console.log(document.getElementsByClassName("css-1id89ip")[i])
          document.getElementsByClassName("css-1id89ip")[i].click();
        }
      }

      const question = document.getElementsByClassName("styled");
      const text = question[0].innerText.toString().replace(/[\r\n]/gm, ' ');
      const images = question[0].querySelectorAll("img");

      if (text && text.trim() !== "" && images.length > 0) {
        const imageData = Array.from(images).map(img => {
          return { type: "image_url", image_url: { url: img.src } };
        });

        resolve([{ type: "text", text: text }, ...imageData]);
      } else if (text && text.trim() !== "") {
        resolve([{ type: "text", text: text }]);
      } else if (images.length > 0) {
        const imageData = Array.from(images).map(img => {
          return { type: "image_url", image_url: { url: img.src } };
        });

        resolve([{ type: "text", text: "Solve this: " }, ...imageData]);
      } else {
        resolve(null); // Resolve with null if no text or images
      }
    }, 700);
  });
}

async function promptChatGPT(prompt, api) {
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
          content: prompt
        }
      ],
      max_tokens: 300, // Maximum number of tokens (words) the model should return
      temperature: 0.8, // Controls the randomness of the output
      stop: '\n', // Stops generation at a specific token
    })
  };
  console.log(requestOptions)
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
  console.log(prompt);
  const response = await promptChatGPT(prompt, api);
  console.log(response);
  return response;
}

main().then(response => {
  const ans = document.getElementsByClassName("w-md-editor-text-input")[0];
  ans.addEventListener("click", function (e) {e.preventDefault();});
  if (response && response.choices && response.choices.length > 0) {
    navigator.clipboard.writeText(response.choices[0].message.content.toString());
    ans.focus();
    ans.select();
    ans.value = "Successfully fetched answer, click here and paste it!";
    //ans.value = "Lorem ipsum dolor sit amet, consectetur"
  }
});


