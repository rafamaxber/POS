import { lazy, Suspense } from 'react';

import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const LoginPage = lazy(() => import('./pages/Login/Login'))
const ProductList = lazy(() => import('./pages/ProductList/ProductList'))

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/login",
    element: <LoginPage onLogin={function () {
      console.log('login')
      return Promise.resolve();
      // return Promise.reject('Erro monstro')
    }} />,
  },
  {
    path: "/stock/view",
    element: <ProductList />,

  },
  {
    path: "/stock/view/:id",
    element: <div>stock::view one!</div>,
  },
  {
    path: "/stock/add",
    element: <div>stock:: add!</div>,
  },
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
