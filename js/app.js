const firebaseConfig = {
    apiKey: "AIzaSyDA3yVi5k-EuRIZJhvRonfFrR2fia0c_Pg",
    authDomain: "quiz-11126.firebaseapp.com",
    projectId: "quiz-11126",
    storageBucket: "quiz-11126.appspot.com",
    messagingSenderId: "974421179858",
    appId: "1:974421179858:web:9f2a811ae0e470cb32dc0b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Función para crear usuario en firestore
const createUser = (user) => {
    db.collection("users")
        .add(user)
        .then((docRef) => console.log("Document written with ID: ", docRef.id))
        .catch((error) => console.error("Error adding document: ", error));
};

//Función para registrarse (Sign Up)
const signUpUser = (email, password) => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log(`se ha registrado ${user.email} ID:${user.uid}`)
            alert(`se ha registrado ${user.email} ID:${user.uid}`)

            // Guarda El usuario en Firestore
            createUser({
                id: user.uid,
                email: user.email,
            });
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log("Error en el sistema" + error.message);
        });
};

//Función para logarse (Log In)
const logInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log(`se ha logado ${user.email} ID:${user.uid}`)
            alert(`se ha logado ${user.email} ID:${user.uid}`)
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        })
}

// Función para log out
const logOutUser = () => {
    let user = firebase.auth().currentUser;
    firebase.auth().signOut().then(() => {
        console.log("Sale del sistema: " + user.email)
    }).catch((error) => {
        console.log("hubo un error: " + error);
    });
}

// Controlar usuario logado
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(`Está en el sistema:${user.email} ${user.uid}`);
    } else {
        console.log("no hay usuarios en el sistema");
    }
});

// Función para togglear la classe 'off'
const toggleOff = (element) => {
    const temporalElement = document.querySelector(`${element}`);
    temporalElement.classList.toggle('off');
}


//SIGN-UP & LOG-IN FORMS
const signUpBtn = document.querySelector('#sign-up-btn');
const signUpForm = document.querySelector('#sign-up-form');
const logInBtn = document.querySelector('#log-in-btn');
const logInForm = document.querySelector('#log-in-form');
const buttons = document.querySelector('.buttons');

signUpBtn.addEventListener('click', () => {
    buttons.classList.toggle('off');
    signUpForm.classList.toggle('scaled-form');
})

logInBtn.addEventListener('click', () => { 
    buttons.classList.toggle('off');
    logInForm.classList.toggle('scaled-form');
})


//PÁGINA DE INICIO
const logOutBtn = document.querySelector('#log-out-btn');
logOutBtn.addEventListener('click', logOutUser)