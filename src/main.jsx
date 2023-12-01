import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import MainPage from './pages/MainPage'
import { None } from './components/None'
import './App.css'
import { ChakraProvider } from "@chakra-ui/react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChannelChat } from './components/ChannelChat'
import { DirectMessage } from './components/DirectMessage'

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
        path: "",
        element: <None />,
        index: true
      },
      {
        path: "m/:receiver_id",
        element: <DirectMessage />,
        loader: async ({params}) => {
          const data = await fetch(`/api/v1/messages?receiver_id=${params.receiver_id}&receiver_class=User`, {
            method: 'GET',
            headers: {
              "access-token": localStorage.getItem("access-token") || "",
              "uid": localStorage.getItem("uid") || "",
              "client": localStorage.getItem("client") || "",
              "expiry": localStorage.getItem("expiry") || "",
              "Content-Type": "application/json"
            }
      })
      
          return { receiver_id: params.receiver_id, data: data}
        }
      },
      {
        path: "channels/:chan_id",
        element: <ChannelChat />,
        loader: async ({params}) => {
          const resData = await fetch(`/api/v1/channels/${params.chan_id}`, {
            method: 'GET',
            headers: {
              "access-token": localStorage.getItem("access-token") || "",
              "uid": localStorage.getItem("uid") || "",
              "client": localStorage.getItem("client") || "",
              "expiry": localStorage.getItem("expiry") || "",
              "Content-Type": "application/json"
            }
      })
          return { id: params.chan_id, resData: resData}
      }
    }
]}
      
    ]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer />
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
)
