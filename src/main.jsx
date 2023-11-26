import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import MainPage from './pages/MainPage'
import './index.css'
import { ChakraProvider } from "@chakra-ui/react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConversationPanel } from './components/ConversationPanel'


const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage /> ,
    index: true
  },
  {
    path: '/sign_up',
    element: <Register />,
  },
  {
    path: '/app',
    element: <MainPage />,
    children: [
      {
        path: "c/:receiver_id",
        element: <ConversationPanel />,
        loader: async ({params}) => {
          //fetch get all messages using params.receiver_id
          const data = await fetch(`/api/v1/messages?receiver_id=${params.receiver_id}&receiver_class=User`, {
            method: 'GET',
            headers: {
              "access-token": localStorage.getItem("access-token") || "",
              "uid": localStorage.getItem("uid") || "",
              "client": localStorage.getItem("client") || "",
              "expiry": localStorage.getItem("expiry") || "",
              "Content-Type": "application/json"
            }
          });

          return { receiver_id: params.receiver_id}
        }
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer />
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
)
