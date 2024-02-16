const models = ["gpt-3.5-turbo", "gpt-4-vision-preview", "gpt-4",  "gpt-3.5-turbo-instruct"]
const endPoints = ["https://api.openai.com/v1/chat/completions", "https://api.openai.com/v1/completions"]

async function getTxt() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for (let i = 0; i < document.getElementsByClassName("css-1id89ip").length; i++) {
        if (document.getElementsByClassName("css-1id89ip")[i].innerText.toUpperCase().includes("DISCUSS")) {
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

async function promptChatGPT(prompt, api, model) {
  const modelName = model; // Specify the model name here
  var url, requestOptions;
  if (model == models[0] || model == models[1] || model == models[2]) {
    url = endPoints[0];
    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 699, // Maximum number of tokens (words) the model should return
        temperature: 0.8, // Controls the randomness of the output
        //stop: '\n', // Stops generation at a specific token
      })
    };
  }
  else {
    url = endPoints[1];
    requestOptions = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
          model: modelName,
          prompt: prompt,
          max_tokens: 699, // Adjust as needed
          temperature: 0.8, // Adjust as needed
          n: 1 // Number of completions to generate
      })
  };
  }
  

  console.log(requestOptions)
  return fetch(url, requestOptions)
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

  const ans = document.getElementsByClassName("w-md-editor-text-input")[0];
  ans.addEventListener("click", function (e) { e.preventDefault(); });
  ans.focus();
  ans.select();
  ans.value = "Please wait for the API to fetch the answer.";
  setToStorage('RESPONSE', ans.value)

  const submit = document.getElementsByClassName("css-1n61s5c")[0]
  submit.addEventListener("click", function (e) {
    setToStorage('RESPONSE', "Please wait for the API to fetch the answer.")
  });

  var response;
  for (let i = 0; i < models.length; i++) {
    response = await promptChatGPT(prompt, api, models[i]);
    if (!response.error) {
      break;
    }
  }
  console.log(response);
  return response;
}

main().then(response => {
  const ans = document.getElementsByClassName("w-md-editor-text-input")[0];
  ans.addEventListener("click", function (e) { e.preventDefault(); });
  if (response && response.choices && response.choices.length > 0) {
    const ans = response.choices[0].message.content.toString().slice(0, 699);
    navigator.clipboard.writeText(ans);
    setToStorage('RESPONSE', ans)
    ans.focus();
    ans.select();
    ans.value = "Successfully copied the answer, paste it here!!";
  }
});


