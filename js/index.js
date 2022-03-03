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

// *** GLOBAL PAGE VARIABLES ***:
// Theese are DOM elements common to every created "page" in the index.html, so they are declared once in order to save time and resources.
const header = document.createElement('header');
document.body.appendChild(header);

const title = document.createElement('h1');
header.appendChild(title);

const main = document.createElement('main');
document.body.appendChild(main);



// *** GLOBAL FIREBASE FUNCTIONS ***:
// Create User Function with custom ID and uid from authentication:

// Sign Up function with email:
const signUp = (auth, signUpEmail, signUpPassword) => {
    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
        .then(userCredential => {
            const user = userCredential.user;
            const userUid = user.uid;
            console.log('Usuario autenticado: ' + signUpEmail)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        })
};

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

// Log Out Function:
const logOut = () => {
    auth.signOut()
        .then(() => { })
        .catch(error => {
            console.log(error)
        })
    
    launchPage()
    document.querySelector('#log-out-btn').remove()
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

// *** DOM FUNCTIONS ***
const createLogOutBtn = () => {
    const logOutBtn = document.createElement('button');
    logOutBtn.innerText = 'Log Out';
    logOutBtn.setAttribute('id', 'log-out-btn');
    logOutBtn.addEventListener('click', logOut);

    document.body.appendChild(logOutBtn);
}

// *** PAGES ***
// Each of theese functions create a "page" with HTML elements

const launchPage = () => {

    // Activate logged user observer:
    isUserLogged()
    

    title.innerText = 'Welcom to Quiz!';

    // Sign Up button is created and and event added to redirect to the form
    const signUpBtn = document.createElement('button');
    signUpBtn.classList.add('sign-buttons');
    signUpBtn.innerText = 'Sign Up';
    main.appendChild(signUpBtn);
    signUpBtn.addEventListener('click', () => {
        signUpProcess = true;
        formPage(); // It goes to the formulary
    })
    document.body.appendChild(signUpBtn)

    // Log In button is created and and event added to redirect to the formulary
    const logInBtn = document.createElement('button');
    logInBtn.classList.add('sign-buttons');
    logInBtn.innerText = 'Log In';
    document.body.appendChild(logInBtn);
    logInBtn.addEventListener('click', () => {
        logInProcess = true;
        formPage(); // It goes to the formulary
    })

    // Remove all previous unnecessary elements, but after the buttons have alredy been created:
    const possibleRemovables = main.childNodes;
    if (possibleRemovables.length > 0) {possibleRemovables.forEach(item => item.remove())}
}

const formPage = () => {
    createForm()
}

const createForm = () => {
    // We have to clear up unneeded buttons:
    document.querySelectorAll('.sign-buttons').forEach(button => button.remove())
    // Creates a standard formulary
    const form = document.createElement('form');
    form.innerHTML = `
                      <label for="name"class="removable">Name:</label>
                      <input type="text" class="removable" id="name"</input>   

                      <label for="email">E-mail:</label>
                      <input type="text" id="email"</input>
                      
                      <label for="password">Password:</label>
                      <input type="password" id="password"</input>
                      
                      <label for="password2" class="removable">Repeat password:</label>
                      <input type="password" class="removable" id="password2"</input>
                      
                      <button class="sign-buttons">Send</button>`;
    main.appendChild(form);

    // If user is signing up, the event calls signUp() function to authenticate and create new user in Firestore
    if (signUpProcess) {
        // Form event        
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const name = event.target.name.value;
            const email = event.target.email.value;
            const password = event.target.password.value;
            const password2 = event.target.password2.value;
            if (password === password2) {
                signUp(auth, email, password);
                form.reset();
                setDoc(doc(db, 'users', email), {
                    name: name,
                    email: email
                });
                signUpProcess = false;
                welcomePage();
            }
            else {
                console.log('Email or password are invalid.');
            }
        })
    }
    else {
        //Removes unnecessary form elements:
        document.querySelectorAll('.removable').forEach(element => element.remove())
        // Form event
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const email = event.target.email.value;
            const password = event.target.password.value;
            logIn(auth, email, password);
            form.reset()
            logInProcess = false;
            welcomePage();
        })
    }
}

const welcomePage = () => {
    console.log('Parece que todo ha ido bien...');
    createLogOutBtn()
}


// Now we call the launchPage() function at the beginning and the process develops itself automatically
launchPage()
// PENDIENTE
// 1) lograr meter el nombre en db; igual hay que crear el usuario y luego actualizarlo con el nombre.