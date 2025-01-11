import { GoogleCredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const GoogleAuth = ({ isLogin = false }) => {
  const { googleLogin } = useAuthStore();
  const navigate = useNavigate();
  console.log("IS GL : ", isLogin);
  // const handleGoogleSignIn = useGoogleLogin({
  //   onSuccess: (response: any) => {
  //     debugger;
  //     return response;
  //   },
  //   onError: (err) => {
  //     debugger;
  //   },
  //   flow: "auth-code",
  // });

  async function handleGoogleSignIn(response: GoogleCredentialResponse) {
    const { credential } = response;

    if (credential) {
      await googleLogin(credential);
      navigate("/");
    }
  }
  return (
    <>
      {/* <button type="button" onClick={() => (window as any).google.accounts.id.prompt()} className="input input-bordered w-full flex items-center gap-2 justify-center">
        <img src="/google.svg" alt="Google Icon" className="size-6" />
        Sign in with Google
      </button> */}

      <GoogleLogin
        onSuccess={handleGoogleSignIn}
        onError={() => {
          console.log("Google auth error");
        }}
      />
    </>
  );
};

export default GoogleAuth;
