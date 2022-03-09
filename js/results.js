// *** FIREBASE SETUP ***:
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    deleteUser,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDA3yVi5k-EuRIZJhvRonfFrR2fia0c_Pg",
    authDomain: "quiz-11126.firebaseapp.com",
    projectId: "quiz-11126",
    storageBucket: "quiz-11126.appspot.com",
    messagingSenderId: "974421179858",
    appId: "1:974421179858:web:9f2a811ae0e470cb32dc0b"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();



const correctLegend = document.querySelector('#correct');
const incorrectLegend = document.querySelector('#incorrect');

// Logged user observer:
const isUserLogged = async () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('Logged user: ' + user.displayName);
            userLogged = true;
            userId = user.email;
            userName = user.displayName;
            getResults(user.email)
                .then(results => getChart(results))
                .then(results => {
                    correctLegend.innerText = `Correct: ${results[results.length - 1].correct}`;
                    incorrectLegend.innerText = `Incorrect: ${results[results.length - 1].incorrect}`;
                })

        } else {
            console.log('No logged user');
            userLogged = false;
            userId = undefined;
            userName = undefined;
        }
    })
}

// Get results to create the user statistics page
const getResults = async (userId) => {
    const docRef = await doc(db, 'users', userId);
    const data = await getDoc(docRef);
    const results = await data.data().results;
    console.log(results)
    return results
}

const getChart = (results) => {
    const data = {
        labels: [
            `Correct: ${results[results.length - 1].correct}`,
            `Incorrect: ${results[results.length - 1].incorrect}`
        ],
        datasets: [{
            label: 'Results',
            data: [results[results.length - 1].correct, results[results.length - 1].incorrect],
            backgroundColor: [
                'rgb(1, 89, 15)',
                'rgb(203, 50, 52)'
            ],
            borderColor: ['lightgrey']
        }]
    };
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            legend: {
                labels: {
                    fontColor: 'white',
                }
            }
        }
    };
    resultsChart = new Chart(document.getElementById('results-chart'),
        config
    );
    return results
}

// const init = async() => {
//     await isUserLogged();
//     const data = await getResults();
//     getChart(data);
// }

//////////////
let userLogged = false;
let userId = undefined;
let userName = undefined;
let resultsChart = undefined;

isUserLogged()

const newGameBtn = document.querySelector('#new-game-btn');
newGameBtn.addEventListener('click', () => {
    resultsChart.destroy()
    window.location.href = "../pages/quiz.html";
})

const menuBtn = document.querySelector('#menu-btn');
menuBtn.addEventListener('click', () => {
    resultsChart.destroy()
    window.location.href = "../index.html";
})