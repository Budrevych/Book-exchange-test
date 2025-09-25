import { auth } from "./firebase/fairbaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "./stores/useAuthStore";
import { Register } from "./page/Register";
import { Home } from "./page/Home";

function App() {
  onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      useAuthStore.getState().setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || null,
      });
    } else {
      useAuthStore.getState().clearUser();
    }
  });
  return (
    <>
      <Home />
    </>
  );
}

export default App;
