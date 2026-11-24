import { Routes, Route } from 'react-router-dom'
import App from "./App.jsx";
import RegisterPage from './pages/Register.jsx';
import NavigationBar from './pages/Navbar.jsx';
import Footer from './pages/Footer.jsx';
import AboutPage from './pages/About.jsx';

export default function IndexPage() {

    // React router page
    // App - homepage
    
    return (
        <>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<App />} /> 
                <Route path="/register" element={<RegisterPage />}/>
                <Route  path='/about' element={<AboutPage />}/>
            </Routes>
            <Footer />
        </>
    );
}