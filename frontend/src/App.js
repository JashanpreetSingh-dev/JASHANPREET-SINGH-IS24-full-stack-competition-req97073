import React from 'react';
import ProductTable from './ProductTable';
import NewProductForm from './NewProductForm';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductTable/>}/>
        <Route path="/addProduct" element={<NewProductForm></NewProductForm>}/>
        <Route path="/editProduct/:id" element={<NewProductForm/>}/>
      </Routes>
    </Router>
    // <div className="App">
    //   <ProductTable/>
    //   <NewProductForm/>
    // </div>
  );
}

export default App;
