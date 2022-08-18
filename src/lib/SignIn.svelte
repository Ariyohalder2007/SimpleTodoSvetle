<script>
  import { auth } from "../lib/firebase";
  import { user } from "../stores/svetleStore";
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

  let currentUser;
  user.subscribe((val) => (currentUser = val));

  async function login() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log("Can't Login", error);
    }
  }
</script>

<button on:click={login}>Sign In</button>
