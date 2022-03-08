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

////////////////

let userLogged = false;
let userId = undefined;
let userName = undefined;

let questions = [];
let correctAnswers = [];
let count = 0;
let results = {
                correct: 0,
                incorrect: 0,
                date: undefined
};

// Logged user observer:
const isUserLogged = () => {
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

isUserLogged()

async function getQuestions() {
    let response = await fetch(`https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple`);
    let data = await response.json();
    let final = await data.results.map((item, index) => {
        questions.push({
            'question': item.question,
            'correct_answer': item.correct_answer,
            'incorrect_answers': item.incorrect_answers
        });
    });
    let response2 = await fetch(`https://api.trivia.willfry.co.uk/questions?categories=general_knowledge&limit=5`);
    let data2 = await response2.json();
    let final2 = await data2.map(item => {
        questions.push({
            'question': item.question,
            'correct_answer': item.correctAnswer,
            'incorrect_answers': item.incorrectAnswers.slice(0, 3)
        });
    })
    questions.sort(() => 0.5 - Math.random());
    questions.forEach(question => {
        correctAnswers.push(question.correct_answer)
    });

}

async function paintQuiz() {

    let randomAnswers = questions.map((quest, index) => {
        return [...questions[index].incorrect_answers, questions[index].correct_answer].sort(() => 0.5 - Math.random())
    })

    const h2 = document.querySelector('h2');
    h2.innerHTML = `${questions[count].question}`;

    const span = document.querySelector('#question-number');
    span.innerText = `Question Number: ${count + 1}`

    const inputs = document.querySelectorAll('.inputClass');
    inputs.forEach((item, index) => {
        item.setAttribute('value', `${randomAnswers[count][index]}`);
    })

    const labels = document.querySelectorAll('label');
    labels.forEach((item, index) => {
        item.innerHTML = `${randomAnswers[count][index]}`;
    })
    count++;

}


const init = async () => {
    await getQuestions();
    await paintQuiz();
}
init()

console.log(correctAnswers);

const getDate = () => {
    const newDate = new Date();
    const day = newDate.getDate() >= 10 ? newDate.getDate() : `0${newDate.getDate()}`;
    const month = newDate.getMonth() >= 10 ? newDate.getMonth()+1 : `0${(newDate.getMonth()+1)}`;
    const year = newDate.getFullYear();
    const hour = newDate.getHours() >= 10 ? newDate.getHours() : `0${newDate.getHours()}`;
    const minutes = newDate.getMinutes() >= 10 ? newDate.getMinutes() : `0${newDate.getMinutes()}`;
    const fullDate = `${day}/${month}/${year} - ${hour}:${minutes}`;
    return fullDate
}

const validation = event => {

    const radio = event.target.answerField.value;

    if (radio == '') {
        console.log('esta vacío');
    } else if (correctAnswers[count - 1] == radio) {
        results.correct += 1;
        console.log('Respuesta Correcta');

    } else if (correctAnswers[count - 1] !== radio) {
        results.incorrect += 1;
        console.log('Respuesta Incorrecta');
    }
    console.log(radio);
};

// Deseleccionar Radios

function unselect() {
    const radio = document.querySelectorAll('.inputClass')
    radio.forEach((x) => x.checked = false);
};

const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (count <= 9) {
        validation(event);
        paintQuiz();
        unselect();
    } 
    else {
        validation(event);
        count = 0;
        unselect();
        results.date = getDate();
        console.log('Se acabó!')
        console.log(results);
        await updateDoc(doc(db, 'users', userId), {
            results: arrayUnion(results)
        })
        
        window.location.href = "../pages/results.html";
        // fin del juego 
    }
});

