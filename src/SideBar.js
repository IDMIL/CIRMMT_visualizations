function createSideBar(backButtonClicked) {
    let element = document.createElement("div");
    element.classList.add("sideBar");
    document.body.appendChild(element);

    let backButton = document.createElement("div");
    backButton.classList.add("button");
    backButton.innerHTML = "Back";
    element.appendChild(backButton);
    element.onclick = backButtonClicked;
}

export default createSideBar;