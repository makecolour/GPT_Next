const models = ["gpt-3.5-turbo", "gpt-4-vision-preview", "gpt-4",  "gpt-3.5-turbo-instruct"]
const endPoints = ["https://api.openai.com/v1/chat/completions", "https://api.openai.com/v1/completions"]

const key = document.getElementById("key");
const save = document.getElementById("save");
const response = document.getElementById("floatingTextarea");
const copy = document.getElementById("copy");
const ai = document.getElementsByClassName("openai")[0];
const question = document.getElementById("question");
const ask = document.getElementById("ask");
var clipboard;

save.addEventListener("click", ()=>{
    const api = key.value;
    setToStorage('API_KEY', api);
    alert("Đã lưu: " + api);
    window.close();
});

copy.addEventListener("click", ()=>{
    navigator.clipboard.writeText(response.value);
    alert("Copied to clipboard");
});

ai.addEventListener("click", ()=>{
    window.open("https://platform.openai.com/api-keys", '_blank').focus()
});

document.addEventListener("DOMContentLoaded", async ()=>{
    const api = await getFromStorage('API_KEY');
    const answer = await getFromStorage('RESPONSE');
    key.value = api;
    if(key.value == "undefined") {
        key.value = "";
    }
    response.value = answer;
    if(response.value == "undefined") {
        response.value = "";
    }
})

ask.addEventListener("click", async() =>{
    const prompt = question.value;
    const api = await getFromStorage('API_KEY');
    var ans;
    for (let i = 0; i < models.length; i++) {
        ans = await promptChatGPT(prompt, api, models[i]);
      if (!ans.error) {
        break;
      }
    }
    console.log(ans);
    setToStorage("RESPONSE", ans.choices[0].message.content.toString());
    response.value = ans.choices[0].message.content.toString();
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