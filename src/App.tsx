import { lazy, Suspense } from 'react';

import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { logInWithEmailAndPassword } from './gateways/firebase';
import { Loading } from './components/Loading/Loading';

const Home = lazy(() => import('./pages/Home/Home'))
const AuthLayout = lazy(() => import('./pages/AuthLayout/AuthLayout'))
const MasterPage = lazy(() => import('./pages/MasterPage/MasterPage'))
const LoginPage = lazy(() => import('./pages/Login/Login'))
const ProductList = lazy(() => import('./pages/ProductList/ProductList'))
const ProductRegister = lazy(() => import('./pages/ProductRegister/ProductRegister'))

const router = createBrowserRouter([
  {
    path: "/",
    element: <MasterPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
      {
        path: "stock",
        element: <ProductList />,
    
      },
      {
        path: "stock/:id",
        element: <ProductRegister />,
      },
      {
        path: "stock/add",
        element: <ProductRegister />,
      },
      {
        path: "stock/:id/edit",
        element: <ProductRegister />,
      },
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage onLogin={({ password, email }) => logInWithEmailAndPassword(email, password)} />,
      },
      // {
      //   path: "logout",
      //   action: logoutUser,
      // },
    ],
  },
]);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      {/* <NavBar /> */}
      <RouterProvider router={router} />
      <ToastContainer position="bottom-center" />
    </Suspense>
  );
}

export default App
