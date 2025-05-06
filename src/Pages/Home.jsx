import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/styles.css';
import L from 'leaflet';
import { UrlPyGeoApi } from '../utils/url';

// Fetch GeoJSON data from PyGeoAPI
const fetchGeoJsonCollection = async (collectionName, setter) => {
  try {
    const response = await fetch(`${UrlPyGeoApi}/collections/${collectionName}/items?limit=1000`);
    const data = await response.json();
    if (data.type === "FeatureCollection") {
      setter(data);
    } else {
      console.error(`Invalid response for ${collectionName}`);
    }
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
  }
};

// GeoJSON style based on 'reservabilityCategory'
const getGeoJsonStyle = (feature) => {
  const category = feature.properties.reservabilityCategory;
  const styles = {
    Office: { color: "#FFAA00", fillColor: "#FFAA00" },
    Laboratory: { color: "#5ADA65", fillColor: "#5ADA65" },
    Classroom: { color: "#ff00bf", fillColor: "#ff00bf" },
  };
  const baseStyle = styles[category] || { color: "#44749D", fillColor: "#5A9FDA" };
  return { ...baseStyle, weight: 2, fillOpacity: 0.5 };
};

// Fit map to GeoJSON bounds
const FitBounds = ({ geoJson, setBounds }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoJson?.features?.length) return;
    const geoJsonLayer = L.geoJSON(geoJson);
    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 22 });
      setBounds(bounds);
    }
  }, [geoJson, map, setBounds]);

  return null;
};

// Restrict map bounds
const RestrictBounds = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.setMaxBounds(bounds.pad(0.2));
    }
  }, [bounds, map]);

  return null;
};

// Render GeoJSON features with interactivity
const GeoJSONLayer = ({ geoJson }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoJson?.features) return;

    const geoJsonLayer = L.geoJSON(geoJson, {
      style: getGeoJsonStyle,
      onEachFeature: (feature, layer) => {
        console.log(feature.properties);
        const assignedTo = feature.properties.assignedTo || feature.properties.assignedToBuildingId || feature.properties.assignedToPersonId; 
        layer.on('mouseover', () => {
          const { name, reservabilityCategory } = feature.properties;
          const popupContent = `
            <strong>Name:</strong> ${name} <br/>
            <strong>Category:</strong> ${reservabilityCategory} <br/>
            <strong>Assigned:</strong> ${assignedTo}<br/>
          `;
          layer.bindPopup(popupContent).openPopup();
          layer.setStyle({ color: "#FF0000", weight: 4, fillColor: "#FF0000", fillOpacity: 0.5 });

          layer.on('mouseout', () => {
            layer.setStyle(getGeoJsonStyle(feature));
            layer.closePopup();
          });
        });
      }
    }).addTo(map);

    return () => map.removeLayer(geoJsonLayer);
  }, [geoJson, map]);

  return null;
};

// Floor switch button
const FloorButton = ({ floor, currentFloor, setFloor }) => {
  const isActive = floor === currentFloor;
  const labelMap = {
    0: "Planta 0",
    1: "Planta 1",
    2: "Planta 2",
    3: "Planta 3",
    4: "Planta 4",
    [-1]: "Sótano 1"
  };

  return (
    <button
      onClick={() => setFloor(floor)}
      className={`px-6 py-3 rounded-lg shadow-md transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2
        ${isActive
          ? 'bg-secondary text-white ring-2 ring-secondary scale-105'
          : 'bg-primary text-white hover:bg-secondary hover:scale-105 focus:ring-primary'}
      `}
    >
      {labelMap[floor]}
    </button>
  );
};

// Legend box
const Legend = () => (
  <div className="bg-white p-4 shadow-lg rounded-lg absolute top-4 right-4 text-sm z-[1000]">
    <h2 className="font-bold mb-2">Legend</h2>
    <ul>
      <li><span className="inline-block w-4 h-4 mr-2 bg-[#FFAA00]"></span> Office</li>
      <li><span className="inline-block w-4 h-4 mr-2 bg-[#5ADA65]"></span> Laboratory</li>
      <li><span className="inline-block w-4 h-4 mr-2 bg-[#ff00bf]"></span> Classroom</li>
      <li><span className="inline-block w-4 h-4 mr-2 bg-[#5A9FDA]"></span> Common Room</li>
    </ul>
  </div>
);

// Main component
export const Home = () => {
  const [bounds, setBounds] = useState(null);
  const [floor, setFloor] = useState(0);
  const [dataGeoJSON, setDataGeoJSON] = useState(null);

  const [floorData, setFloorData] = useState({
    0: null, 1: null, 2: null, 3: null, 4: null, [-1]: null
  });

  // Filter GeoJSON by floor
  const filterGeoJsonByFloor = (geoJson, floor) => {
    if (!geoJson?.features) return null;
    const filtered = geoJson.features.filter(f => f.properties.floor === floor.toString());
    return { type: "FeatureCollection", features: filtered };
  };

  useEffect(() => {
    fetchGeoJsonCollection("postgres", setDataGeoJSON);
  }, []);

  useEffect(() => {
    if (!dataGeoJSON) return;

    const updatedFloorData = {
      0: filterGeoJsonByFloor(dataGeoJSON, 0),
      1: filterGeoJsonByFloor(dataGeoJSON, 1),
      2: filterGeoJsonByFloor(dataGeoJSON, 2),
      3: filterGeoJsonByFloor(dataGeoJSON, 3),
      4: filterGeoJsonByFloor(dataGeoJSON, 4),
      [-1]: filterGeoJsonByFloor(dataGeoJSON, "S1"),
    };
    setFloorData(updatedFloorData);
  }, [dataGeoJSON]);

  const floors = [0, 1, 2, 3, 4, -1];
  const currentGeoJson = floorData[floor];

  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center gap-8 relative">
      <h1 className="text-5xl font-bold text-primary mt-2">Floor {floor}</h1>

      <div className="flex gap-4 justify-center flex-wrap">
        {floors.map(f => (
          <FloorButton key={f} floor={f} currentFloor={floor} setFloor={setFloor} />
        ))}
      </div>

      <div className="relative">
        <Legend />
        <MapContainer
          center={[41.683657, -0.888999]}
          zoom={28}
          maxZoom={30}
          zoomDelta={0.5}
          zoomSnap={0.5}
          style={{ height: "800px", width: "1200px" }}
          doubleClickZoom={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="<a href='https://carto.com/' target='_blank'>CARTO</a>"
            maxZoom={22}
          />

          <FitBounds geoJson={floorData[0]} setBounds={setBounds} />
          {bounds && <RestrictBounds bounds={bounds} />}
          {currentGeoJson && <GeoJSONLayer geoJson={currentGeoJson} />}
        </MapContainer>
      </div>
    </div>
  );
};
