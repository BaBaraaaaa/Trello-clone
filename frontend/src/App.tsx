
import { Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { MockDBProvider } from "./contexts/MockDBContext";

function App() {
  return (
    <MockDBProvider>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </MockDBProvider>
  );
}

export default App;
