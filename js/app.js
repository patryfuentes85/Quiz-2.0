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

            // Una vez se ha logado el usuario, se elimina la pantalla de sign in y se revela la pantalla de inicio
            document.querySelector('section:nth-of-type(1)').classList.toggle('off');
            document.querySelector('section:nth-of-type(2)').classList.toggle('off');

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

            // Una vez se ha logado el usuario, se elimina la pantalla de sign in y se revela la pantalla de inicio
            document.querySelector('section:nth-of-type(1)').classList.toggle('off');
            document.querySelector('section:nth-of-type(2)').classList.toggle('off');
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


        // Una vez se ha deslogado el usuario, se elimina la pantalla de inicio y se vuelve a la pantalla de log in
        document.querySelector('section:nth-of-type(1)').classList.toggle('off');
        document.querySelector('section:nth-of-type(2)').classList.toggle('off');
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

// *** SIGN UP ***
const signUpBtn = document.querySelector('#sign-up-btn');
//Función para crear y redireccionar a la página de registro al clickar el botón SignUp:
const generateSignUpPage = () => {
    // La clase off hace "display: none"
    [...document.querySelectorAll('.buttons')].map(button => button.classList.add('off'));
    document.querySelector('#title > h1').innerText = 'Sign Up';
    const form = document.createElement('form');
    //Se añade el evento al formulario y se le pasa la función 'signUpUser' al final
    form.onsubmit = function (event) {
        event.preventDefault();
        let email = event.target.elements.email.value;
        let password = event.target.elements.password.value;
        let password2 = event.target.elements.password2.value;
        password === password2 ? signUpUser(email, password) : alert("error password");
    }
    //Se añaden los campos del formulario para el registro
    form.classList.add('center-content');
    form.innerHTML = `<label for='email'>E-mail:</label>
                      <input type='text' id='email' name='email'>
                      <label for='password'>Password:</label>
                      <input type='password' id='password' name='password'>
                      <label for='password2'>Repeat password:</label>
                      <input type='password' id='password2' name='password2'>
                      <button type='submit'>Sign Up</button>`;

    document.querySelector('#title').after(form);
}
//Se añade la función al botón correspondiente
signUpBtn.addEventListener('click', generateSignUpPage);



//   *** LOG IN ***
const logInBtn = document.querySelector('#log-in-btn');
//Función para crear y redireccionar a la página de logeo al clickar el botón LogIn:
const generateLogInPage = () => {
    // La clase off hace "display: none"
    [...document.querySelectorAll('.buttons')].map(button => button.classList.add('off'));
    document.querySelector('#title > h1').innerText = 'Log In';
    const form = document.createElement('form');
    //Se añade el evento al formulario y se le pasa la función 'logInUser' al final
    form.onsubmit = function (event) {
        event.preventDefault();
        let email = event.target.elements.email.value;
        let password = event.target.elements.password.value;
        logInUser(email, password)
    }
    //Se añaden los campos del formulario para el log in
    form.classList.add('center-content');
    form.innerHTML = `<label for='email'>E-mail:</label>
                      <input type='text' id='email' name='email'>
                      <label for='password'>Password:</label>
                      <input type='password' id='password' name='password'>
                      <button type='submit'>Log In</button>`;

    document.querySelector('#title').after(form);
}
//Se añade la fucnión al botón de log in
logInBtn.addEventListener('click', generateLogInPage);


//PÁGINA DE INICIO
const logOutBtn = document.querySelector('#log-out-btn');
logOutBtn.addEventListener('click', logOutUser)