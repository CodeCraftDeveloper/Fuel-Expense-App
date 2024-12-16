import React, { useState, useEffect } from "react";
// import Realm from "realm-web";
import * as Realm from "realm-web";

// Define your Realm schema
const AppSchema = {
  name: "App",
  properties: {
    _id: "objectId",
    name: "string",
    description: "string",
    email: "string",
    createdAt: "date",
  },
  primaryKey: "_id",
};

// Initialize the Realm app
const app = new Realm.App({ id: "application-0-dlhopxm" });

// Get a reference to the Realm database
const database = app.currentUser.mongoClient("mongodb-atlas").db("test");

// Get a reference to the collection
const collection = database.collection("sampleCollection");

export default function FetchData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the collection
    collection
      .find()
      .then((results) => {
        setData(results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <h1>Fetched Results from database</h1>
        </div>
      </div>
      <div className="container mt-3">
        <div className="row">
          {data.map((item, index) => (
            <div key={index} className="col-md-4">
              <div className="card">
                <img
                  className="card-img-top"
                  src={item.image} // Replace with a default image or a dynamic image URL
                  alt="Card image"
                  height={300}
                  width={300}
                />
                <div className="card-body">
                  <p className="card-text">
                    <b>Name: </b>
                    {item.name}
                    <br />
                    <b>Description:</b>
                    {item.description}
                    <br />
                    <b>Email:</b>
                    {item.email}
                    <br />
                    <b>Created At:</b>
                    {item.createdAt.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
