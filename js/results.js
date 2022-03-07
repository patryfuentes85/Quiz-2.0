// *** FIREBASE SETUP ***:
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, deleteUser, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

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

// Logged user observer:
const isUserLogged = async () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('Logged user: ' + user.displayName);
            userLogged = true;
            userId = user.email;
            userName = user.displayName;

        } else {
            console.log('No logged user');
            userLogged = false;
            userId = undefined;
            userName = undefined;
        }
    })
}

// Get results to create the user statistics page
const getResults = async () => {
    const docRef = await doc(db, 'users', 'daniel@daniel.com');
    const data = await getDoc(docRef);
    const results = await data.data().results;
    console.log(results)
    return results
}

const getChart = (results) => {
    const data = {
        labels: [
          'Correct',
          'Incorrect'
        ],
        datasets: [{
          label: 'Results',
          data: [results[results.length - 1].correct, results[results.length - 1].incorrect],
          backgroundColor: [
            'rgb(0, 255, 0)',
            'rgb(255, 0, 0)'
          ]
        }]
      };
      const config = {
        type: 'doughnut',
        data: data,
      };
      resultsChart = new Chart(document.getElementById('results-chart'),
      config
    );
}

const asyncLauncher = async() => {
    const a = await isUserLogged();
    const b = await getResults();
    getChart(b);
}

//////////////
let userLogged = false;
let userId = undefined;
let userName = undefined;
let resultsChart = undefined;


asyncLauncher();



const newGameBtn = document.querySelector('#new-game-btn');
newGameBtn.addEventListener('click', () => {
    window.location.href = "../pages/quiz.html";
})

const menuBtn = document.querySelector('#menu-btn');
myProfileBtn.addEventListener('click', () => {
    window.location.href = "../index.html";
})