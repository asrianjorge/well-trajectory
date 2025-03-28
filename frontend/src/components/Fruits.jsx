import React, { useState, useEffect } from "react";
import api from "../api.js";
import AddFruitForm from "./AddFruitForm";



const FruitList = () => {
  const [fruits, setFruits] = useState([]);

  const fetchFruits = async () => {
    try {
      const response = await api.get("/fruits");
      setFruits(response.data.fruits);
    } catch (error) {
      console.error("Error fetching fruits", error);
    }
  };

  const addFruit = async (fruitName) => {
    try {
      await api.post("/fruits", { name: fruitName });
      fetchFruits();
    } catch (error) {
      console.error("Error adding fruits", error);
    }
  };

  useEffect(() => {
    fetchFruits();
  }, []);

  return (
    <div>
      <h2>Fruits List</h2>
      <ul>
        {fruits.map((fruit, index) => (
          <li key={index}>{fruit.name}</li>
        ))}
      </ul>
      <AddFruitForm addFruit={addFruit} />
    </div>
  );
};
export default FruitList;
