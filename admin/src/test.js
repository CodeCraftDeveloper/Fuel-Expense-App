import React, { useState } from "react";
import * as Realm from "realm-web";

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image1: null,
    image2: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, [name]: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Initialize Realm app
    const app = new Realm.App({ id: "your-realm-app-id" }); // Replace with your Realm App ID
    const credentials = Realm.Credentials.anonymous();

    try {
      const user = await app.logIn(credentials);
      const mongodb = app.currentUser.mongoClient("mongodb-atlas");
      const collection = mongodb
        .db("your-db-name")
        .collection("your-collection-name");

      const newDocument = {
        name: formData.name,
        description: formData.description,
        image1: formData.image1, // Base64 image
        image2: formData.image2, // Base64 image
        createdAt: new Date(),
      };

      // Insert the document into the MongoDB collection
      await collection.insertOne(newDocument);
      alert("Data saved successfully!");

      // Clear the form
      setFormData({
        name: "",
        description: "",
        image1: null,
        image2: null,
      });
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  return (
    <div>
      <h1>Submit Data to MongoDB Atlas</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description: </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Image 1: </label>
          <input
            type="file"
            name="image1"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <div>
          <label>Image 2: </label>
          <input
            type="file"
            name="image2"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
