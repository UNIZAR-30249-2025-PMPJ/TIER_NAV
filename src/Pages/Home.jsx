import React, { useEffect, useState } from 'react';
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/styles.css';
import { dataGeoJSONFloor0 } from '../Data/floor0';
import { dataGeoJSONFloor1 } from '../Data/floor1';
import { dataGeoJSONFloor2 } from '../Data/floor2';
import { dataGeoJSONFloor3 } from '../Data/floor3';
import { dataGeoJSONFloor4 } from '../Data/floor4';
import { dataGeoJSONFloor5 } from '../Data/floor5';
import { dataGeoJSONFloorS1 } from '../Data/floorS1';


import L from 'leaflet';

// Function to define the style of the GeoJSON based on its properties
const getGeoJsonStyle = (feature) => {

  // // if the 'USO' attribute is 'DESPACHO', assign a color
  // if (feature.properties.USO === 'DESPACHO') {
  //   return {
  //     color: "#FF5733",
  //     weight: 2,
  //     fillColor: "#FF5733",
  //     fillOpacity: 0.5
  //   };
  // }
  // // if the 'USO' attribute is 'LABORATORIO', assign a color
  // if (feature.properties.USO === 'LABORATORIO') {
  //   return {
  //     color: "#5A9FDA",
  //     weight: 2,
  //     fillColor: "#5A9FDA",
  //     fillOpacity: 0.5
  //   };
  // }

  // Default style, if the 'USO' attribute is not none of the above
  return {
    color: "#44749D",
    weight: 2,
    fillColor: "#5A9FDA",
    fillOpacity: 0.5
  };
};

// Component to adjust the zoom of the map based on the GeoJSON bounds
const FitBounds = ({ geoJson, setBounds }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoJson || !geoJson.features || geoJson.features.length === 0) return;

    // Get the bounds of the GeoJSON
    const geoJsonLayer = L.geoJSON(geoJson);
    const bounds = geoJsonLayer.getBounds();

    // Adjust the zoom of the map based on the bounds
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 22 });
      setBounds(bounds); 
    }
  }, [geoJson, map, setBounds]);

  return null;
};

// Component to restrict the bounds of the map
const RestrictBounds = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (!bounds) return;

    // Expand the bounds by 20%
    const expandedBounds = bounds.pad(0.2); 
    map.setMaxBounds(expandedBounds);
  }, [bounds, map]);

  return null;
};

// Component to handle the GeoJSON layer events like dbclick or mouseover
const GeoJSONLayer = ({ geoJson }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoJson || !geoJson.features) return;

    // Create a GeoJSON layer with the data and add it to the map
    const geoJsonLayer = L.geoJSON(geoJson, {
      style: getGeoJsonStyle,  // Apply the style to each feature
      onEachFeature: (feature, layer) => {
        // Show a popup with the feature information when the mouse is over it
        layer.on('mouseover', () => {
          const { properties } = feature;
          const popupContent = `
            <strong>Nombre:</strong> ${properties.Nombre} <br/>
            <strong>Uso:</strong> ${properties.USO} <br/>
            <strong><a href="https://${properties.Link}" target="_blank">Más información</a></strong> <br/>
          `;
          layer.bindPopup(popupContent).openPopup();

          // Change the style of the feature when the mouse is over it
          layer.setStyle({
            color: "#FF0000",
            weight: 4,
            fillColor: "#FF0000",
            fillOpacity: 0.5
          });

          // Restore the original style when the mouse is out
          layer.on('mouseout', () => {
            layer.setStyle(getGeoJsonStyle(feature));  // Restaurar el estilo original
            layer.closePopup();
          });
        });

        // Log the name of the feature when double-clicked
        //TODO: Navigate to a space page when double-clicked 
        layer.on('dblclick', () => {
          console.log("Double click on:", feature.properties.Nombre);
        });
      }
    }).addTo(map);

    return () => {
      map.removeLayer(geoJsonLayer);
    };
  }, [geoJson, map]);

  return null;
};

// Home page component (Main component)
export const Home = () => {
  const [bounds, setBounds] = useState(null);
  const [floor, setFloor] = useState(0);
  const [geoJsonData, setGeoJsonData] = useState(null);

useEffect(() => {
  fetch("http://localhost:5001/collections/ciudades/items/5308")
    .then((response) => response.json())
    .then((data) => {
      // Detecta si es una sola Feature
      if (data.type === "Feature") {
        setGeoJsonData({
          type: "FeatureCollection",
          features: [data]
        });
      } else {
        setGeoJsonData(data); // Ya es FeatureCollection
      }
      })
    .catch((error) => {
      console.error("Error fetching GeoJSON:", error);
    });
}, []);


  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-8">
       <h1 className="text-5xl font-bold text-primary mt-2">Floor {floor}</h1>
      <div className="flex gap-4 justify-center ">
       
        <button
          onClick={() => setFloor(0)}
          className={`px-6 py-3 rounded-lg shadow-md transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2
          ${floor === 0 
            ? 'bg-secondary text-white ring-2 ring-secondary scale-105' 
            : 'bg-primary text-white hover:bg-secondary hover:scale-105 focus:ring-primary'}
          `}
        >
          Planta 0
        </button>
        <button
          onClick={() => setFloor(1)}
          className={`px-6 py-3 rounded-lg shadow-md transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2
          ${floor === 1 
            ? 'bg-secondary text-white ring-2 ring-secondary scale-105' 
            : 'bg-primary text-white hover:bg-secondary hover:scale-105 focus:ring-primary'}
          `}
        >
          Planta 1
        </button>
        <button
          onClick={() => setFloor(2)}
          className={`px-6 py-3 rounded-lg shadow-md transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2
          ${floor === 2 
            ? 'bg-secondary text-white ring-2 ring-secondary scale-105' 
            : 'bg-primary text-white hover:bg-secondary hover:scale-105 focus:ring-primary'}
          `}
        >
          Planta 2
        </button>
        <button
          onClick={() => setFloor(3)}
          className={`px-6 py-3 rounded-lg shadow-md transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2
          ${floor === 3 
            ? 'bg-secondary text-white ring-2 ring-secondary scale-105' 
            : 'bg-primary text-white hover:bg-secondary hover:scale-105 focus:ring-primary'}
          `}
        >
          Planta 3
        </button>
        <button
          onClick={() => setFloor(4)}
          className={`px-6 py-3 rounded-lg shadow-md transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2
          ${floor === 4 
            ? 'bg-secondary text-white ring-2 ring-secondary scale-105' 
            : 'bg-primary text-white hover:bg-secondary hover:scale-105 focus:ring-primary'}
          `}
        >
          Planta 4
        </button>
        <button
          onClick={() => setFloor(5)}
          className={`px-6 py-3 rounded-lg shadow-md transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2
          ${floor === 5 
            ? 'bg-secondary text-white ring-2 ring-secondary scale-105' 
            : 'bg-primary text-white hover:bg-secondary hover:scale-105 focus:ring-primary'}
          `}
        >
          Planta 5
        </button>
        <button
          onClick={() => setFloor(-1)}
          className={`px-6 py-3 rounded-lg shadow-md transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2
          ${floor === -1 
            ? 'bg-secondary text-white ring-2 ring-secondary scale-105' 
            : 'bg-primary text-white hover:bg-secondary hover:scale-105 focus:ring-primary'}
          `}
        >
          Sótano 1
        </button>
      </div>

      <MapContainer
        center={[41.683657, -0.888999]}
        zoom={28}
        maxZoom={30}
        zoomDelta={0.5}
        zoomSnap={0.5}
        style={{ height: "800px", width: "1200px" }}
        doubleClickZoom={false}
      >
        {/* Base layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="<a href='https://carto.com/' target='_blank'>CARTO</a>"
          maxZoom={22}
        />

        {/* Fit the map bounds to the GeoJSON */}
        <FitBounds geoJson={dataGeoJSONFloor0} setBounds={setBounds} />
        {bounds && <RestrictBounds bounds={bounds} />}

        {/* Custom GeoJSON layer */}
        {floor === 0 && <GeoJSONLayer geoJson={geoJsonData} />}
        {floor === 1 && <GeoJSONLayer geoJson={dataGeoJSONFloor1} />}
        {floor === 2 && <GeoJSONLayer geoJson={dataGeoJSONFloor2} />}
        {floor === 3 && <GeoJSONLayer geoJson={dataGeoJSONFloor3} />}
        {floor === 4 && <GeoJSONLayer geoJson={dataGeoJSONFloor4} />}
        {floor === 5 && <GeoJSONLayer geoJson={dataGeoJSONFloor5} />}
        {floor === -1 && <GeoJSONLayer geoJson={dataGeoJSONFloorS1} />}
      </MapContainer>
    </div>
  );
};
