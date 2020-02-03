//keeps track of favorite quotes and who said them 
//populate page with quotes 
//each quote should follow structure in the readme
//create a form with a NEW QUOTE 
//add it to the list of quotes by using pessimistic rendering 

document.addEventListener("DOMContentLoaded", function(){
    fetchAllQuotes().then(quotes => renderAllQuotes(quotes));
    likesOrDelete();

});


function updateLikes(quoteId) {
//incrementer
    const li = document.getElementById(`${quoteId}`);
    const button = li.children[0].children[3];
    const likeSpan = button.children[0];
    let likeCount = parseInt(likeSpan.innerText)
    likeSpan.innerText = likeCount + 1;

}

function likesOrDelete() {
    const quoteContainer = document.getElementById("quote-list");
    quoteContainer.addEventListener("click", function(event){
        const quoteId = event.target.parentElement.parentElement.id
        const buttonElement = event.target
        if(buttonElement.className === "btn-success") {
            postLikes({ quoteId: parseInt(quoteId) })
            .then(() => updateLikes(quoteId))
        } else if(buttonElement.className === "btn-danger") {
            deleteAQuote(quoteId)
            .then(res => {
                if(res.status === 200) {
                    const element = document.getElementById(quoteId);
                    element.remove()
                }
            } )
        }
    })
}

function deleteAQuote(quoteId){
    const url = `http://localhost:3000/quotes/${quoteId}`
    const configuration = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application.json"
        }
    }
    return fetch(url, configuration)
}

function postLikes(likes) {
    const url = "http://localhost:3000/likes"
    const configuration = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application.json"
        },
        body: JSON.stringify(likes)
    }
    return fetch(url, configuration);
}


function fetchAllQuotes() {
    const url = 'http://localhost:3000/quotes?_embed=likes'
    return fetch(url)
    .then(res => res.json())
    .catch(error => console.log(error))
};

function renderAllQuotes(quotes) {
    quotes.forEach(quote => renderAQuote(quote))
}

function renderAQuote(quote) {
    const quoteContainer = document.getElementById("quote-list");
    
    const quoteCard =  `
    <li id="${quote.id}" class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
    </li> 
    `
    quoteContainer.innerHTML += quoteCard;
}

