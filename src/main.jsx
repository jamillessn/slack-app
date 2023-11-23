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
    loader: async ({params}) => {
    return fetch(params.conversationId)
    },
    children: [
      {
        path: "c/:user_id",
        element: <ConversationPanel />,
        loader: async ({params}) => {
          //fetch get all messages using params.user_id
          // return await fetch(`/api/v1/messages?receiver_id=${params.user_id}&receiver_class=User`)
          const data = await fetch(`/api/v1/messages?receiver_id=${params.user_id}&receiver_class=User`)
          return { user_id: params.user_id, data}
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
