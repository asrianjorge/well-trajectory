import React from "react";
import FruitList from "./components/Fruits";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Fruit Management App</h1>
      </header>
      <main>
        <FruitList />
      </main>
    </div>
  );
};

export default App;
