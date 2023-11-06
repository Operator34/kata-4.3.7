const searchList = document.querySelector(".searchList");
const search = searchList.querySelector(".search");
const cardList = document.querySelector(".cardList");
const btn = cardList.querySelector(".addTask");
let cardSearch;

function debounce(callback, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}

const debouncedDisplayOptions = debounce((e) => {
    displayOptions.call(search, e);
}, 400);

search.addEventListener("keyup", debouncedDisplayOptions);

async function getResultSearch(val) {
    try {
        const response = await fetch(
            `https://api.github.com/search/repositories?q=${val}`
        );

        const result = await response.json();
        return result.items.slice(0, 5);
    } catch (error) {
        if (error.message === "Failed to fetch") {
            window.location.href = "error.html";
        }
    }
}
function removeCardSearch() {
    const wrapperCardSearch = document.querySelector(".wrapperCardSearch");
    if (wrapperCardSearch) {
        wrapperCardSearch.remove();
    }
}
async function displayOptions(e) {
    if (!this.value && e.key.length > 1) {
        removeCardSearch();
    }
    if (this.value) {
        const resultSearch = await getResultSearch(this.value);
        addItemSearchList(resultSearch);
    }
}

function addItemSearchList(dataSearch) {
    if (cardSearch) {
        removeCardSearch();
    }
    const fragment = document.createDocumentFragment();
    const wrapper = document.createElement("ul");
    dataSearch.forEach((repo) => {
        wrapper.classList.add("wrapperCardSearch");
        cardSearch = document.createElement("li");
        cardSearch.classList.add("cardSearch");
        cardSearch.setAttribute("id", repo.id);
        cardSearch.textContent = repo.name;
        cardSearch.addEventListener("click", (event) => {
            addToFavorites(event, dataSearch);
            removeCardSearch();
        });
        wrapper.append(cardSearch);
    });
    fragment.append(wrapper);
    searchList.append(fragment);

    function addToFavorites(event, dataSearch) {
        const selectedElem = dataSearch.find(
            (elem) => elem.id === parseInt(event.currentTarget.id)
        );
        search.value = "";
        const fragment = document.createDocumentFragment();
        const wrapper = document.createElement("div");
        wrapper.classList.add("wrapperCardFavorites");

        //Текстовое описание
        cardDescription = document.createElement("div");
        cardDescription.classList.add("cardDescription");
        cardFavorite = document.createElement("div");
        cardFavorite.classList.add("cardFavorite");
        cardFavorite.setAttribute("id", selectedElem.id);
        cardName = document.createElement("p");
        cardName.textContent = `Name: ${selectedElem.name}`;
        cardOwner = document.createElement("p");
        cardOwner.textContent = `Owner: ${selectedElem.owner.login}`;
        cardStars = document.createElement("p");
        cardStars.textContent = `Stars: ${selectedElem.stargazers_count}`;
        cardDescription.append(cardName, cardOwner, cardStars);
        cardFavorite.append(cardDescription);
        // Крестик удалить
        btnLogoDelete = document.createElement("div");
        btnLogoDelete.classList.add("btnLogoDelete");
        btnLogoDelete.setAttribute("id", selectedElem.id);
        logoDeleteline1 = document.createElement("div");
        logoDeleteline1.classList.add("logoDeleteline1");
        logoDeleteline2 = document.createElement("div");
        logoDeleteline2.classList.add("logoDeleteline2");
        btnLogoDelete.append(logoDeleteline1, logoDeleteline2);
        cardFavorite.append(btnLogoDelete);
        wrapper.append(cardFavorite);
        fragment.append(wrapper);
        cardList.append(fragment);

        //Вешаем обработчик на кнопку удалитьы
        btnLogoDelete.addEventListener("click", (event) => {
            delCardFavorite(event);
        });
    }
}

function delCardFavorite(event) {
    deleteCardFavorite = cardList.querySelector(
        `[id="${event.currentTarget.id}"]`
    );
    deleteCardFavorite.remove();
}
