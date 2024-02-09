const key = document.getElementById("key");
const save = document.getElementById("save");

save.addEventListener("click", ()=>{
    const api = key.value;
    setToStorage('API_KEY', api);
    alert("Đã lưu: " + api);
    //window.close();
});

document.addEventListener("DOMContentLoaded", async ()=>{
    const api = await getFromStorage('API_KEY');
    key.value = api;
})