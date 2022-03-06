// I declare all the functions and variables first, and then I start to execute them in order to create the diferent "pages"
// that will be displayed to the user as he/she proceeds with the authentication / login process.

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
const provider = new GoogleAuthProvider();

// *** GLOBAL VARIABLES ***:
let signUpProcess = false;
let logInProcess = false;
let userLogged = false;
let userId = undefined;
let userName = undefined;


// *** GLOBAL FUNCTIONS ***
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
const getResults = async (db, collection, docId) => {
    const docRef = doc(db, collection, docId);
    const data = await getDoc(docRef);
    const results = data.data().results;
    return results
}

// Fech DOM element function:
const domElement = (element) => {
    const retrievedElement = document.querySelector(`${element}`);
    return retrievedElement
}



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

    if (signUpPassword === signUpPassword2 /* aquí los regex*/) {
        try {
            // Sign Up Process
            await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
                .then((userCredential) => {

                    console.log('User registered');
                })
                .then(() => updateProfile(auth.currentUser, {
                    displayName: signUpName
                }))
            //Create document in Firestore
            await setDoc(doc(db, 'users', signUpEmail), {
                userName: signUpName,
                email: signUpEmail,
                results: []
            })
            domElement('#index-sign-up-page-section').classList.toggle('off');
            domElement('#index-welcome-page-section').classList.toggle('off');
            domElement('#title').innerText = `Welcome ${auth.currentUser.displayName}`;
            domElement('#sign-up-form').reset();
        }
        catch (error) {
            console.log('Error: ', error)
        }


    }
    else {
        alert('Different passwords');
    }
})

// Sign Up with Google:
domElement('#sign-up-google-btn').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            return user
        })
        .then(user => {
            setDoc(doc(db, 'users', user.email),
                {
                    userName: user.displayName,
                    email: user.email,
                    results: []
                });
        })
        .then(() => {
            domElement('#index-launch-page-section').classList.toggle('off');
            domElement('#index-welcome-page-section').classList.toggle('off');
            domElement('#title').innerText = `Welcome ${userName.split(' ')[0]}`;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
})

//Log in formulary event:
domElement('#log-in-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const logInEmail = event.target.logInEmail.value;
    const logInPassword = event.target.logInPassword.value;

    try {
        await signInWithEmailAndPassword(auth, logInEmail, logInPassword)
            .then(userCredential => {
                const user = userCredential.user;
                console.log('Usuario logado: ' + user.displayName);
            })
        domElement('#index-log-in-page-section').classList.toggle('off');
        domElement('#index-welcome-page-section').classList.toggle('off');
        domElement('#title').innerText = `Welcome ${userName}`; // ${auth.currentUser.displayName}
        domElement('#log-in-form').reset();
    }
    catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
        alert('Incorrect user or password')
    }
})

//My profile page event:
// Chart is declared "undefined" beacuse we need to declare it in the global scope in order to be able to destroy it anytime,
// but we can't actualize it right now, or the chart would be displayed before having the data. 
let resultsChart = undefined;
//Button event:
domElement('#my-profile-btn').addEventListener('click', async () => {
    domElement('#index-welcome-page-section').classList.toggle('off');
    domElement('#index-my-profile-page-section').classList.toggle('off');
    domElement('#title').innerText = 'My Profile';

    // Get the results from user and paint them in a graphic using Chart.js
    const results = await getResults(db, 'users', userId);
    const labels = results.map(item => item.date);
    const corrects = results.map(item => item.correct);
    const data = {
        labels: labels,
        datasets: [{
            label: 'Correct Answers',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: corrects,
        }]
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    max: 10,
                    min: 0,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    };

    // Now that we have the data, we can define the chart and let it appear on screen
    resultsChart = new Chart(
        document.getElementById('myChart'),
        config
    );
})

// Change name option:
domElement('#update-name-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const newName = event.target['update-name'].value;
    const docRef = doc(db, 'users', userId);
    updateDoc(docRef, {
        userName: newName
    });

})

// Reset statistics option:
domElement('#reset-stats').addEventListener('click', () => {
    const docRef = doc(db, 'users', userId);
    updateDoc(docRef, {
        results: []
    })
});

// Delete account option:
domElement('#delete-account').addEventListener('click', () => {
    const user = auth.currentUser;
    try {
        deleteUser(user).then(() => {
            console.log('User deleted')
        })
        deleteDoc(doc(db, 'users', userId))
            .then(() => {
                console.log('Doc deleted')
            })
        resultsChart.destroy()
    } catch (error) {
        console.log(error)
    }

    domElement('#index-launch-page-section').classList.toggle('off');
    domElement('#index-my-profile-page-section').classList.toggle('off');
    domElement('#title').innerText = `Title`;
})

// Go back to Welcome page button:
domElement('#back-my-profile-btn').addEventListener('click', () => {
    // This is why the chart had to be declared on global scope as undefined, so we could destroy it here
    resultsChart.destroy()

    domElement('#index-welcome-page-section').classList.toggle('off');
    domElement('#index-my-profile-page-section').classList.toggle('off');
    domElement('#title').innerText = `Welcome ${userName}`;
})





// THIS IS FOR THE QUIZ.HTML PAGE
// Get date:
const getDate = () => {
    const date = new Date();
    const date2 = `0${date.getDate()}/0${date.getMonth()}/${date.getFullYear()}`;
    const time = `${date.getHours()}:${date.getMinutes()}`;
    return [date2, time].join(' ')
}


//Update results:
domElement('#update-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const data = event.target['update-results'].value;
    const docRef = doc(db, 'users', userId);
    updateDoc(docRef, {
        results: arrayUnion({
            date: getDate(),
            correct: data,
            incorrect: data + 5
        })
    });

})