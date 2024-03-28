const models = ["gpt-3.5-turbo", "gpt-4-vision-preview", "gpt-4", "gpt-3.5-turbo-instruct"]
const endPoints = ["https://api.openai.com/v1/chat/completions", "https://api.openai.com/v1/completions"]

const key = document.getElementById("key");
const save = document.getElementById("save");
const response = document.getElementById("floatingTextarea");
const copy = document.getElementById("copy");
const ai = document.getElementsByClassName("openai")[0];
const question = document.getElementById("question");
const ask = document.getElementById("ask");
const clear = document.getElementById("clearButton");
const show = document.getElementById("togglePassword");

var clipboard;

save.addEventListener("click", () => {
  const api = key.value;
  setToStorage('API_KEY', api);
  key.type = "password";
  alert("Đã lưu: " + api);
  window.close();
});

copy.addEventListener("click", () => {
  navigator.clipboard.writeText(response.value);
  //alert("Copied to clipboard");
  window.close();
});

ai.addEventListener("click", () => {
  window.open("https://platform.openai.com/api-keys", '_blank').focus()
});

clear.addEventListener("click", () => {
  question.value = '';
  question.focus();
});

document.addEventListener("DOMContentLoaded", async () => {
  const api = await getFromStorage('API_KEY', '');
  const answer = await getFromStorage('RESPONSE', '');
  const theme = await getFromStorage('THEME', '');
  const prompt = await getFromStorage('QUESTION', '');

  key.value = api;
  if (key.value == "undefined") {
    key.value = "";
  }
  else {
    key.type = "password";
  }
  response.value = answer;
  if (response.value == "undefined") {
    response.value = "";
  }

  question.value = prompt;
  if (question.value == "undefined") {
    question.value = ""
  }
  update(theme);
})

show.addEventListener("click",() => {
  if(key.type == "password")
  {
    key.type = "text"
    show.innerHTML = "Hide"
  }
  else{
    key.type = "password"
    show.innerHTML = "Show"
  }
});

let version = chrome.runtime.getManifest().version;
document.getElementById('version').textContent = version;

ask.addEventListener("click", async () => {
  response.value = "Please wait for the API to fetch the answer.";
  const prompt = question.value;
  setToStorage('QUESTION', prompt);
  const api = await getFromStorage('API_KEY');
  var ans;
  for (let i = 0; i < models.length; i++) {
    ans = await promptChatGPT(prompt, api, models[i]);
    if (!ans.error) {
      break;
    }
  }
  if (ans.error) {
    const answer = ans.error.message;
    setToStorage('RESPONSE', "Error: " + answer);
    response.value = "Error: "+answer;
  }
  else {
    if(ans.choices[0].text)
    {
      var answer = ans.choices[0].text;
    }
    else{
      var answer = ans.choices[0].message.content.toString();
    }
    response.value = answer;
    setToStorage('RESPONSE', answer);
  }
  console.log(ans);
});

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
        'Authorization': `Bearer ${api}`
      },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        max_tokens: 1000, // Adjust as needed
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

const themeBtn = document.getElementsByClassName("bg")
for (let i = 0; i < themeBtn.length; i++) {
  themeBtn[i].addEventListener("click", () => {
    update(themeBtn[i].value);
    setToStorage("THEME", themeBtn[i].value);
  })
}

const body = document.getElementById("body")

function update(value = "light") {
  const paths = document.getElementById("setting").getElementsByTagName("path");
  const logo = document.getElementById("logo").getElementsByTagName("path");

  switch (value) {
    case "light":
      body.setAttribute("data-bs-theme", "light");
      for (let i = 0; i < paths.length; i++) {
        paths[i].attributes.fill.nodeValue = "#0f1729"
      }
      for (let i = 0; i < logo.length; i++) {
        logo[i].style.fill = "black"
      }
      logo[1].style.fill = "#f27125"
      logo[2].style.fill = "#f27125"
      break;
    case "dark":
      body.setAttribute("data-bs-theme", "dark");
      for (let i = 0; i < paths.length; i++) {
        paths[i].attributes.fill.nodeValue = "#dee2e6"
      }
      logo[0].style.fill = "#dee2e6"
      logo[1].style.fill = "#f27125"
      logo[2].style.fill = "#f27125"
      logo[3].style.fill = "#dee2e6"
      break;
    case "sys":
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return update("dark")
      }
      else {
        return update("light")
      }
      break;
    default:
      break;
  }
}
