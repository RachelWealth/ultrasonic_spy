function updateNavigation(value){
    const navigationElement = document.getElementById("Navigation");
    navigationElement.textContent = value;
    navigationElement.insertBefore(document.createElement("div"),navigationElement.firstChild)
}