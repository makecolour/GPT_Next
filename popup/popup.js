const key = document.getElementById("key");
const save = document.getElementById("save");

save.addEventListener("click", ()=>{
    key.preventDefault();
    const api = key.value;

    setToStorage('API_KEY', api);
    alert("Đã lưu: " + api);
    window.close();
});

document.addEventListener("DOMContentLoaded", async ()=>{
    const api = getFromStorage('API_KEY');
    key.value = api;
})