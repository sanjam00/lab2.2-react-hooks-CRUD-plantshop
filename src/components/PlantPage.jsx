import { React, useState, useEffect } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
  //state will live here, app doesn't need to handle state based on the structure of the application
  const [plants, setPlants] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  function fetchPlantList() {
    fetch("http://localhost:6001/plants")
      .then(r => {
        if (!r.ok) {
          throw new Error("Fetch request failed")
        } else {
          return r.json()
        }
      })
      .then(data => {
        console.log(data)
        const plantsWithStock = data.map(p => ({ ...p, inStock: p.inStock ?? true }));
        setPlants(plantsWithStock)
      })
      .catch(error => console.log("Fetch request failed", error))
  }

  useEffect(fetchPlantList, [])

  function toggleStock(id) {
    setPlants(plants.map(plant =>
      plant.id === id
        ? { ...plant, inStock: !plant.inStock }
        : plant
    ))
  }

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main>
      <NewPlantForm onAddPlant={newPlant => setPlants([...plants, newPlant])} />
      <Search searchTerm={searchTerm} onSearch={setSearchTerm} />
      <PlantList plants={filteredPlants} onToggleStock={toggleStock} />
    </main>
  );
}

export default PlantPage;
