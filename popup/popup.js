const key = document.getElementById("key");
const save = document.getElementById("save");
const response = document.getElementById("floatingTextarea");
const copy = document.getElementById("copy");
const ai = document.getElementsByClassName("openai")[0];
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
