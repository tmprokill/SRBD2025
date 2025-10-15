import "./App.css";
import { Route, Routes } from "react-router";
import HomePage from "./features/home/components/homepage";
import LoginPage from "./features/auth/login/loginpage";
import { Header } from "./components/layout/header/header";
import { Footer } from "./components/layout/footer/footer";
import ExternalLoginCallbackPage from "./features/auth/login/externalLoginCallbackPage";

function App() {


  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/external-callback" element={<ExternalLoginCallbackPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default App;
