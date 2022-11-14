const searchWrapper = document.querySelector('.search-input');
const inputBox = document.querySelector('input');
const suggestionBox = document.querySelector('.autocomplite-box');
const inputField = document.getElementsByClassName('input-field');
// 
const favoriteBox = document.querySelector('.favorite-box');
const favoriteWrapper = document.querySelector('.favorite-wrapper');

// getting data from github API
async function searchPages(query) {
    try {
        let repoNames = [];
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
        const jsonResponce = await response.json();
        const resultArray = await jsonResponce.items;
        // getting repo names
        for (repository in resultArray) {
            repoNames.push(resultArray[repository].name);
        }
        // gettin them as list of names
        repoNames = repoNames.map((data) => {
            return data = '<li>' + data + '</li>';
        })
        if (inputField[0].value.length != 0) {
            searchWrapper.classList.add("active");
            showResults(repoNames);
        }
    } catch (error) {
        console.log(error);
    }
}


// Show results 
function showResults(repoNames) {
    let nameList;
    if (!repoNames.length) {
        nameList = [];
    } else {
        nameList = repoNames.join('');
    }
    suggestionBox.innerHTML = nameList;
}


const debounce = (fn, ms) => {
    let timeout;
    return function () {
        const fnCall = () => { fn.apply(this, arguments) }
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms)
    };
}

const debounceSearchInput = debounce(searchPages, 505);

inputBox.onkeyup = (e) => {
    let userData = e.target.value;
    if (inputField[0].value.length !== 0) {
        debounceSearchInput(userData);
    } else {
        searchWrapper.classList.remove("active");
    }
}


inputField[0].addEventListener('click', () => {
    if (inputField[0].value.length == 0) {
        searchWrapper.classList.remove("active");
    }
})


// Selecting and adding chosen item

suggestionBox.addEventListener('click', (e) => {
    getMoreAboutRepoDebounce(e.target.innerText);
    inputField[0].value = '';
    searchWrapper.classList.remove("active");
})


async function getMoreAboutRepo(selectedItem) {
    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${selectedItem}&per_page=1`);
        const jsonResponce = await response.json();
        const repoName = await jsonResponce.items[0].name;
        const repoOwner = await jsonResponce.items[0].owner.login;
        const repoStars = await jsonResponce.items[0].stargazers_count;
        showFavoriteItem(repoName, repoOwner, repoStars);
    } catch (error) {
        console.log(error);
    }
}

const getMoreAboutRepoDebounce = debounce(getMoreAboutRepo, 505);

const showFavoriteItem = (repoName, repoOwner, repoStars) => {

    const cloneOfFavoriteBox = favoriteBox.cloneNode(true);
    const cloneOfNode = cloneOfFavoriteBox.childNodes;
    // making new favorite post
    [...cloneOfNode][1].innerText = [...cloneOfNode][1].innerText.replace('replace', repoName);
    [...cloneOfNode][3].innerText = [...cloneOfNode][3].innerText.replace('replace', repoOwner);
    [...cloneOfNode][5].innerText = [...cloneOfNode][5].innerText.replace('replace', repoStars);
    // adding class active
    cloneOfFavoriteBox.classList.add("active");
    favoriteWrapper.prepend(cloneOfFavoriteBox);
}

// Close box

favoriteWrapper.addEventListener('click', (e) => {
    if (e.target.classList[1] != 'fa-close') return;
    let boxToClose = e.target.closest('.favorite-box');
    boxToClose.remove();
})