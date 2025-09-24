
import { Outlet } from "react-router-dom";
import Dashboard from "./layouts/Dashboard";

function App() {
  return (
    <Dashboard>
      <Outlet />
    </Dashboard>
  );
}

export default App;
