import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter } from 'react-router-dom'
import NotFound from './NotFound'
import AdminCreation from './AdminCreation'

createRoot(document.getElementById("root")!).render(<App />);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/create-admin",
        element: <AdminCreation />
      },
    ],
  },
]);
