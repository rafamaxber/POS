import { lazy, Suspense } from 'react';

import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

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
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage onLogin={function () {
              console.log('login')
              return Promise.resolve();
              // return Promise.reject('Erro monstro')
            }} />,
          },
          // {
          //   path: "logout",
          //   action: logoutUser,
          // },
        ],
      },
    ]
  }
]);

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      {/* <NavBar /> */}
      <RouterProvider router={router} />
      <ToastContainer position="bottom-center" />
    </Suspense>
  );
}

export default App
