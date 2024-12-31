import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedRoutes from './pages/ProtectedRoutes';
import AddressList from './components/AddressList';
import AddressForm from './components/AddressForm';
import MyMapComponent from './pages/Search';

const router = createBrowserRouter([
    {
        element: <ProtectedRoutes />,
        children: [
            {
                path: '/',
                element: <Home />
            }, {
                path: '/profile',
                element: <AddressList />
            }, {
                path: '/address-form',
                element: <AddressForm />
            }, {
                path: '/search',
                element: <MyMapComponent />
            }
        ]
    },
    {
        path: '/auth/login',
        element: <SignIn />
    },
    {
        path: '/auth/register',
        element: <SignUp />
    }
])

export default router;