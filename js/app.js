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
            // Signed in
            let user = userCredential.user;
            console.log(`se ha registrado ${user.email} ID:${user.uid}`)
            alert(`se ha registrado ${user.email} ID:${user.uid}`)
            // ...
            // Guarda El usuario en Firestore
            createUser({
                id: user.uid,
                email: user.email,
                message: "Hola que tal"
            });
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log("Error en el sistema" + error.message);
        });
};


// Página home:
const signUpBtn = document.querySelector('#sign-up-btn');
const logInBtn = document.querySelector('#log-in-btn');

//Redirección del botón SignUp a la" página" de registro:
const generateSignPage = () => {
    [...document.querySelectorAll('button')].map(button => button.classList.add('off'));
    document.querySelector('#title > h1').innerText = 'Sign Up';
    const form = document.createElement('form');
    form.onsubmit = function (event) {
        event.preventDefault();
        console.log('It works 1')
        let email = event.target.elements.email.value;
        let password = event.target.elements.password.value;
        let password2 = event.target.elements.password2.value;
        password === password2 ? signUpUser(email,password) : alert("error password");
    }
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
signUpBtn.addEventListener('click', generateSignPage)

// Página Sign Up:








