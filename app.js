const { createStore } = Redux;

// Initial State
const initialState = {
    movies: [],
    nextId: 1
};

// Action Types
const ADD_MOVIE = 'ADD_MOVIE';
const EDIT_MOVIE = 'EDIT_MOVIE';
const DELETE_MOVIE = 'DELETE_MOVIE';
const TOGGLE_WATCHED = 'TOGGLE_WATCHED';
const RATE_MOVIE = 'RATE_MOVIE';
const REVIEW_MOVIE = 'REVIEW_MOVIE';

// Action Creators
const addMovie = (movie) => ({ type: ADD_MOVIE, movie });
const editMovie = (movie) => ({ type: EDIT_MOVIE, movie });
const deleteMovie = (id) => ({ type: DELETE_MOVIE, id });
const toggleWatched = (id) => ({ type: TOGGLE_WATCHED, id });
const rateMovie = (id, rating) => ({ type: RATE_MOVIE, id, rating });
const reviewMovie = (id, review) => ({ type: REVIEW_MOVIE, id, review });

// Reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_MOVIE:
            return {
                ...state,
                movies: [...state.movies, { ...action.movie, id: state.nextId, watched: false, rating: 0, review: '' }],
                nextId: state.nextId + 1
            };
        case EDIT_MOVIE:
            return {
                ...state,
                movies: state.movies.map(movie =>
                    movie.id === action.movie.id ? { ...action.movie, id: movie.id } : movie
                )
            };
        case DELETE_MOVIE:
            return {
                ...state,
                movies: state.movies.filter(movie => movie.id !== action.id)
            };
        case TOGGLE_WATCHED:
            return {
                ...state,
                movies: state.movies.map(movie =>
                    movie.id === action.id ? { ...movie, watched: !movie.watched } : movie
                )
            };
        case RATE_MOVIE:
            return {
                ...state,
                movies: state.movies.map(movie =>
                    movie.id === action.id ? { ...movie, rating: action.rating } : movie
                )
            };
        case REVIEW_MOVIE:
            return {
                ...state,
                movies: state.movies.map(movie =>
                    movie.id === action.id ? { ...movie, review: action.review } : movie
                )
            };
        default:
            return state;
    }
};

// Store
const store = createStore(reducer);

// DOM Elements
const movieForm = document.getElementById('movie-form');
const movieList = document.getElementById('movie-list');
const movieIdInput = document.getElementById('movie-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const yearInput = document.getElementById('year');
const genreInput = document.getElementById('genre');

// Render Function
const render = () => {
    const state = store.getState();
    movieList.innerHTML = '';
    state.movies.forEach(movie => {
        const li = document.createElement('li');
        li.className = movie.watched ? 'watched' : '';
        li.innerHTML = `
            <span>${movie.title} (${movie.year}) - ${movie.genre}</span>
            <span>${movie.description}</span>
            <span>Rating: ${movie.rating}</span>
            <span>Review: ${movie.review}</span>
            <button onclick="editMovie(${movie.id})">Edit</button>
            <button onclick="deleteMovie(${movie.id})">Delete</button>
            <button onclick="toggleWatched(${movie.id})">${movie.watched ? 'Unwatch' : 'Watch'}</button>
            <button onclick="rateMovie(${movie.id})">Rate</button>
            <button onclick="reviewMovie(${movie.id})">Review</button>
        `;
        movieList.appendChild(li);
    });
};

// Add Movie Handler
movieForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = movieIdInput.value;
    const title = titleInput.value;
    const description = descriptionInput.value;
    const year = yearInput.value;
    const genre = genreInput.value;
    if (id) {
        store.dispatch(editMovie({ id: parseInt(id), title, description, year, genre }));
    } else {
        store.dispatch(addMovie({ title, description, year, genre }));
    }
    movieForm.reset();
    movieIdInput.value = '';
    render();
});

// Edit Movie Handler
window.editMovie = (id) => {
    const state = store.getState();
    const movie = state.movies.find(movie => movie.id === id);
    movieIdInput.value = movie.id;
    titleInput.value = movie.title;
    descriptionInput.value = movie.description;
    yearInput.value = movie.year;
    genreInput.value = movie.genre;
};

// Delete Movie Handler
window.deleteMovie = (id) => {
    store.dispatch(deleteMovie(id));
    render();
};

// Toggle Watched Handler
window.toggleWatched = (id) => {
    store.dispatch(toggleWatched(id));
    render();
};

// Rate Movie Handler
window.rateMovie = (id) => {
    const rating = prompt('Enter rating (1-5):');
    if (rating) {
        store.dispatch(rateMovie(id, parseInt(rating)));
        render();
    }
};

// Review Movie Handler
window.reviewMovie = (id) => {
    const review = prompt('Enter review:');
    if (review) {
        store.dispatch(reviewMovie(id, review));
        render();
    }
};

// Initial Render
render();

// Subscribe to store changes
store.subscribe(render);

