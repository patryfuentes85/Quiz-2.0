// I declare all the functions and variables first, and then I start to execute them in order to create the diferent "pages"
// that will be displayed to the user as he/she proceeds with the authentication / login process.

// *** FIREBASE SETUP ***:
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

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

// *** GLOBAL VARIABLES ***:
let signUpProcess = false;
let logInProcess = false;
let userLogged = false;


// *** GLOBAL FIREBASE FUNCTIONS ***:

// Log In Function with email:
const logIn = (auth, logInEmail, logInPassword) => {
    signInWithEmailAndPassword(auth, logInEmail, logInPassword)
        .then(userCredential => {
            const user = userCredential.user;
            console.log('Usuario logado: ' + logInEmail)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        })
};

// Create user Function in Firestore
const createUser = (db, collection, signUpEmail, signUpName) => {
    setDoc(doc(db, collection, signUpName), {
        name: signUpName,
        email: signUpEmail
    })
}

// Log Out Function:
const logOut = () => {
    auth.signOut()
        .then(() => { })
        .catch(error => {
            console.log(error)
        })
    document.querySelector('#index-welcome-page-section').classList.toggle('off');
    document.querySelector('#index-launch-page-section').classList.toggle('off');
    document.querySelector('#title').innerText = 'Title';

}

// Log In Observer Function:
const isUserLogged = () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('Logged user: ' + user.uid);
            userLogged = true;
        } else {
            console.log('No logged user');
            userLogged = false;
        }
    })
}

// *** GLOBAL FUNCTIONS ***
// Fech DOM element function:
const domElement = (element) => {
    const retrievedElement = document.querySelector(`${element}`);
    return retrievedElement
}

// CALL FUNCTIONS:
//Log out button event:
domElement('#log-out-btn').addEventListener('click', () => {
    logOut();
})
// Logged user observer event:
isUserLogged();


//Launch page:
domElement('#sign-up-btn').addEventListener('click', () => {
    domElement('#index-launch-page-section').classList.toggle('off');
    domElement('#index-sign-up-page-section').classList.toggle('off');
    domElement('#title').innerText = 'Sign Up';
})
domElement('#log-in-btn').addEventListener('click', () => {
    domElement('#index-launch-page-section').classList.toggle('off');
    domElement('#index-log-in-page-section').classList.toggle('off');
    domElement('#title').innerText = 'Log In';
})

//Sign Up Formulary event:
domElement('#sign-up-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const signUpName = event.target.signUpName.value;
    const signUpEmail = event.target.signUpEmail.value;
    const signUpPassword = event.target.signUpPassword.value;
    const signUpPassword2 = event.target.signUpPassword2.value;
    const usersRef = collection(db, "users");

    if (signUpPassword === signUpPassword2 /* aquí los regex*/) {
        try {
            // Sign Up Process
            await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
                .then((userCredential) => {
                    console.log('User registered')
                })

            //Create document in Firestore
            await setDoc(doc(usersRef, signUpEmail), {
                username: signUpName,
                email: signUpEmail
            })
        }
        catch (error) {
            console.log('Error: ', error)
        }

        domElement('#index-sign-up-page-section').classList.toggle('off');
        domElement('#index-welcome-page-section').classList.toggle('off');
        domElement('#title').innerText = 'Welcome';
        domElement('#sign-up-form').reset();
    }
    else {
        console.log('Incorrect e-mail or password');
    }
})

//Log in formulary event:
domElement('#log-in-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const logInEmail = event.target.logInEmail.value;
    const logInPassword = event.target.logInPassword.value;

    logIn(auth, logInEmail, logInPassword);

    domElement('#index-log-in-page-section').classList.toggle('off');
    domElement('#index-welcome-page-section').classList.toggle('off');
    domElement('#title').innerText = 'Welcome';
    domElement('#log-in-form').reset();
})

//My profile page event:
domElement('#my-profile-btn').addEventListener('click', () => {
    domElement('#index-welcome-page-section').classList.toggle('off');
    domElement('#index-my-profile-page-section').classList.toggle('off');
    domElement('#title').innerText = 'My Profile';

})