import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Detail from "./pages/deatail/Detail";
import Layout from "./layout";
function App() {
  return (
    <div className="font-vazir">
      <Layout>
        <Routes>
          <Route path="*" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/detail" element={<Detail />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
