const api_key = "70afb3b3"
const api_url = "http://www.omdbapi.com/?apikey=" + api_key + "&t=";
var movieFromAPI;

function openPage(pageName, elmnt, color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
    if (document.getElementById("MyList").style.display == "block") {
        loadMyList();
    }
}
function searchInputOnChange(titleValue) {
    titleValue = titleValue.trim().replaceAll(" ", "+");
    if (titleValue.length >= 3)
        getapi(api_url + titleValue)
}

function bookmarkManager(imdbID,newMovie) {
    if (localStorageToArray().indexOf(imdbID) >= 0) {
        localStorage.removeItem(imdbID);
        document.getElementById(imdbID).src = 'Pictures/bookmarkNotSaved.png';
        loadMyList();
    }
    else{
        localStorage.setItem(newMovie.imdbID, JSON.stringify(newMovie));
        console.log(imdbID);
        document.getElementById(imdbID).src = 'Pictures/bookmarkSaved.png';
    }
}

function loadMyList() {
    var movieIDsInLocalStorage = localStorageToArray();
    var moviesInstring = "";
    for (let i = 0; i < movieIDsInLocalStorage.length; i++) {
        var movieData = JSON.parse(localStorage.getItem(movieIDsInLocalStorage[i]));
        moviesInstring = moviesInstring + makeHTMLMovie(movieData.Poster, movieData.Title, movieData.Year, movieData.Runtime, movieData.Plot, movieData.Actors, movieData.imdbRating, movieData.imdbID);
    }

    document.getElementById("MyListMovie").innerHTML = moviesInstring;
}
function makeHTMLMovie(poster = "Pictures/noimage.jpg", titile = "Title: N/A", year = "N/A", runtime = "N/A", plot = "N/A", actors = "N/A", imdbRating = "N/A", imdbID) {
    var finalRateing
    if (imdbRating != "N/A") finalRateing = imdbRating + "/10 " + rateingMaker(imdbRating);
    else finalRateing = "N/";
    if (localStorageToArray().indexOf(imdbID) >= 0) 
        var isBookmarked = `<img onclick=bookmarkManager(id,'') id='` + imdbID + `' src='Pictures/bookmarkSaved.png'>`;
    else var isBookmarked = `<img onclick=bookmarkManager(id,movieFromAPI) id='` + imdbID + `' src='Pictures/bookmarkNotSaved.png'>`;
    return `
    <div class='row p-4'>
    <div class='col-lg-4'>
        <img id='poster' class='card-img-top' src='`+ poster + `' alt='Poster'>
    </div>
    <div class='col-lg-8 col-md-12 '>
        <div class='row'> <div class='col-lg-12 .h-25 p-4'> <div id='title' class='h1 text-center'>`+ titile + `</div></div> </div>
        <div class='row'>
            <div class='col-6 h5 p-2' id='year'>Year: `+ year + `</div>
            <div class='col-6 h5 p-2 text-end' id='runtime'>Runtime: `+ runtime + `</div>
        </div>
        <div class='row'>
            <div class='col-12 h5 p-2' id='plot'>`+ plot + `</div>
        </div>
        <div class='row'>
            <div class='col-12 col-lg-6 h5 p-2' id='actors'> Actors: `+ actors + ` </div> 
            <div class='col-12 col-lg-6 h5 p-2 text-sm-start text-end' id='imdbRating'> Rateing: `+ finalRateing + ` </div>
        </div>
        <div class='row'>
            <div class='col-6'> <a href='https://www.imdb.com/title/`+ imdbID + `' target='_blank' id='imdbID'><img src='Pictures/IMDb.png' alt='Read More' height='50px'></a> </div> 
            <div class='col-6 text-end'> <a id='save '>`+ isBookmarked +`</a> </div>
        </div>
    </div>
    </div>`;
}

function localStorageToArray() {
    const movieIDsInLocalStorage = [];
    for (let i = 0; i < localStorage.length; i++) {
        movieIDsInLocalStorage.push(localStorage.key(i));
    }
    return movieIDsInLocalStorage;
}
function rateingMaker(imdbRateing) {
    let star = '';
    for (let i = 0; i < 10; i++) {
        if (imdbRateing > i + 0.5)
            star = star + `<span class="fa fa-star checked"></span>`;
        else star = star + `<span class="fa fa-star "></span>`;
    }
    return star;

}

// Defining async function
async function getapi(url) {
    // Storing response
    const response = await fetch(url);
    // Storing data in form of JSON
    var data = await response.json();
    movieFromAPI = data;
    if (data.Response != "False") {
        moviesInstring = makeHTMLMovie(data.Poster, data.Title, data.Year, data.Runtime, data.Plot, data.Actors, data.imdbRating, data.imdbID)
        document.getElementById("movie").innerHTML = moviesInstring;
        document.getElementById("warning").style = "visibility:hidden";
        document.getElementById("movie").style = "visibility:visible";
    }
    else if (data.Response == "False") {
        document.getElementById("warning").style = "visibility:visible";
        document.getElementById("movie").style = "visibility:hidden";
    }

}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();