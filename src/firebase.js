// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyA_yfNcxG6DqjiE-vpA7TTWkn60AFQyikg',
    authDomain: 'svelte-crud-414fe.firebaseapp.com',
    projectId: 'svelte-crud-414fe',
    storageBucket: 'svelte-crud-414fe.appspot.com',
    messagingSenderId: '1003474569003',
    appId: '1:1003474569003:web:c62150d71798444fa3676e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);