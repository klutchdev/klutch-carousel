import { auth } from './index';

const provider = new auth.GoogleAuthProvider();

export const googleSignIn = async () => {
  await auth
    .signInWithPopup(provider)
    .then((result) => console.info(`${result.user} signed in`))
    .catch((error) => console.log(error));
};

export const signOut = () => auth.signOut();

export const signIn = async (email, password) =>
  await auth.signInWithEmailAndPassword(email, password);

export const signUpWithEmail = async (email, password) =>
  await auth.createUserWithEmailAndPassword(email, password);
