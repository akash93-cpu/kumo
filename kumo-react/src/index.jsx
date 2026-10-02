import { Routes, Route } from 'react-router-dom'
import App from "./App.jsx";
import NavigationBar from './pages/Navbar.jsx';

export default function IndexPage() {

    // React router page
    // App - homepage
    
    return (
        <>
            {/* <NavigationBar /> */}
            <Routes>
                <Route path="/" element={<App />} /> 
            </Routes>
        </>
    );
}