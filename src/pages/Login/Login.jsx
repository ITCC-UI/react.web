import React from "react";
import "./login.scss"
import Sidebar from "../../components/sidebar";

const Login = () => {
    return ( 
        <div className="loginPage">
            <section className="signUp">
      
<Sidebar/>
        <main>
            <div className="main-container">
                <div className="signUpContainer">
                    <header>
                        <h1>
                            INDUSTRIAL TRAINING COORDINATING CENTER
                        </h1>
                        <h3><i>bridging the gap between theory and practical....</i></h3>


                        <div className="logo">
                            <img src="../../../../static/assets/images/logo_new.png" alt="University of Ibadan Logo"/>
                        </div>
                    </header>

                    <div className="signUpForm">
                        <div className="todo">
                            Sign In
                        </div>
                        <div className="signInError">
                            Invalid email or password!
                        </div>
                        <form action="/redirect to main dashboard" method="post" className="formSignUp" id="signupForm">


                            <input type="email" name="email" id="email" placeholder="Email" autocomplete="on"/>

                            <div className="password">
                                <input type="password" name="password" id="password" placeholder="Password" required/>

                            </div>
                            <button className="signIn" type="submit">Sign In</button>

                            <div className="or">
                                <hr/> <span>
                                    or
                                </span>
                            </div>

                            <div className="signInWithGoogle">
                                <a href="googleAPIHere" className="googleSign">
                                    <img src="../../../../static/assets/images/google.png" alt="Google Image"/>
                                    Continue with Google
                                </a>
                            </div>


                            <div className="login">
                                Don't have an account? <span><a href="/signUp">Create an Account</a></span>
                            </div>

                            <div className="reset">
                                Forgotten Password? <span><a href="password_reset.html">Reset Password</a></span>
                            </div>
                        </form>


                    </div>
                </div>
            </div>
        </main>

        <div className="barsMobile">
            <div className="purpleBar">

            </div>
            <div className="goldBar">

            </div>
        </div>
    </section>



        </div>
     );
}
 
export default Login;