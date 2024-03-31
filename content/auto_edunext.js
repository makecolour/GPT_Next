const models = ["gpt-3.5-turbo", "gpt-4-vision-preview", "gpt-4",  "gpt-3.5-turbo-instruct"]
const endPoints = ["https://api.openai.com/v1/chat/completions", "https://api.openai.com/v1/completions"]
const label = {};
var temp;

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

      setToStorage('QUESTION', text);

      if (text && text.trim() !== "" && images.length > 0) {
        const imageData = Array.from(images).map(img => {
          return { type: "image_url", image_url: { url: img.src } };
        });
        setToStorage('RESPONSE', label.loading.message)
        setToStorage('QUESTION', "");
        resolve([{ type: "text", text: text }, ...imageData]);
      } else if (text && text.trim() !== "") {
        setToStorage('RESPONSE', label.loading.message)
        resolve([{ type: "text", text: text }]);
      } else if (images.length > 0) {
        const imageData = Array.from(images).map(img => {
          return { type: "image_url", image_url: { url: img.src } };
        });
        setToStorage('RESPONSE', label.loading.message)
        setToStorage('QUESTION', "");
        resolve([{ type: "text", text: label.solveThis.message }, ...imageData]);
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
        max_tokens: 1000, // Maximum number of tokens (words) the model should return
        temperature: Number(temp), // Controls the randomness of the output
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
          'Authorization': `Bearer ${api}`
      },
      body: JSON.stringify({
          model: modelName,
          prompt: prompt,
          max_tokens: 1000, // Adjust as needed
          temperature: Number(temp), // Adjust as needed
          n: 1 // Number of completions to generate
      })
  };
  }
  
  console.log(requestOptions)
  return fetch(url, requestOptions)
    .then(response => response.json())
    .catch(error => {
      console.error(label.error.message, error);
      return null;
    });
}

// Example usage
const main = async () => {
  const api = await getFromStorage('API_KEY', '');
  const lang = await getFromStorage('LANG', '');
  const temperature = await getFromStorage('TEMP', '');
  temp = temperature;
  const res = await fetch(chrome.runtime.getURL(lang));
  const messages = await res.json();
  Object.assign(label, messages);

  const ans = document.getElementsByClassName("w-md-editor-text-input")[0];
  if(ans)
  {
    ans.addEventListener("click", function (e) { e.preventDefault(); });
    ans.focus();
    ans.value = "";
  }

  const prompt = await getTxt();
  setToStorage('RESPONSE', label.loading.message);
  // const submit = document.getElementsByClassName("css-1n61s5c")[0]
  // if(submit)
  // {
  //   submit.addEventListener("click", function (e) {
  //     setToStorage('RESPONSE', "Please wait for the API to fetch the answer.")
  //     });
  // }
  
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

  if(response.error)
  {
    const answer = response.error.message;
    setToStorage('RESPONSE', label.error.message+answer);
    if(ans)
    {
      ans.value = label.errorPopup.message;
    }
  }
  else if (response && response.choices && response.choices.length > 0) {
    if(response.choices[0].text)
    {
      var answer = response.choices[0].text;
    }
    else{
      var answer = response.choices[0].message.content.toString();
    }
    navigator.clipboard.writeText(answer);
    setToStorage('RESPONSE', answer)
    if(ans)
    {
      ans.focus();
      ans.select();
      ans.value = label.success.message;
    }
  }
});


