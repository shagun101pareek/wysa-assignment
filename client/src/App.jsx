import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import StepperForm from "./pages/StepperForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/submit/:id" element={<StepperForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;