import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAMVr9Kz2W708Vg0kp2H1D-kIShSibhcjY',
  authDomain: 'myportfolio-cd931.firebaseapp.com',
  projectId: 'myportfolio-cd931',
  storageBucket: 'myportfolio-cd931.firebasestorage.app',
  messagingSenderId: '932607181380',
  appId: '1:932607181380:web:84fe32c7dfb143083cb211',
  measurementId: 'G-5ZDQFVC88V'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// Restrict to a specific account
googleProvider.setCustomParameters({
  login_hint: 'stibinaugustine3047@gmail.com',
  prompt: 'select_account'
})

export const ALLOWED_EMAIL = 'stibinaugustine3047@gmail.com'
