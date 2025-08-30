import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Route, Routes } from "react-router";
import HomePage from "../pages/HomePage.jsx";
import AuthPage from "../pages/AuthPage.jsx";
import { Navigate } from "react-router";
import toast from "react-hot-toast";
import * as Sentry from '@sentry/react'


const App = () => {
  const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);
 
  return (
    <div>
      <>
 

        <SignedIn>
          <SentryRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<Navigate to={"/"} replace />} />
          </SentryRoutes>
        </SignedIn>
        <SignedOut>
          <SentryRoutes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to={"/auth"} replace />} />
          </SentryRoutes>
        </SignedOut>

       
      </>
    </div>
  );
};

export default App;
