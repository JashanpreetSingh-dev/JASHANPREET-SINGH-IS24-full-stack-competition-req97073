import React from 'react';
import ProductTable from './ProductTable';
import NewProductForm from './NewProductForm';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  // This is the main component of the application. It is responsible for routing between the different pages.
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductTable />} />
        <Route path="/addProduct" element={<NewProductForm></NewProductForm>} />
        <Route path="/editProduct/:id" element={<NewProductForm />} />
      </Routes>
    </Router>
  );
}

export default App;
