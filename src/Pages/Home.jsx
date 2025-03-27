import React, { useEffect, useState } from 'react'
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import '../styles/styles.css'
import { dataGeoJSON } from '../Data/planta0';
import L from 'leaflet';

// adjust the map bounds to fit the geojson layer
const FitBounds = ({ geoJson, setBounds }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoJson || !geoJson.features || geoJson.features.length === 0) return;

    const geoJsonLayer = L.geoJSON(geoJson);
    const bounds = geoJsonLayer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 22 });
      setBounds(bounds); // Pass bounds to parent
    }
  }, [geoJson, map, setBounds]);

  return null;
};

const RestrictBounds = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (!bounds) return;
    
    const boundsArray = [
      [bounds.getSouthWest().lat - 1.001, bounds.getSouthWest().lng - 1.001], // Slightly expanded SW corner
      [bounds.getNorthEast().lat + 1.001, bounds.getNorthEast().lng + 1.001], // Slightly expanded NE corner
    ];

    console.log("Applying maxBounds:", boundsArray); // Debugging log
    map.setMaxBounds(bounds);
  }, [bounds, map]);

  return null;
};

// Estilo del GeoJSON
const geoJsonStyle = {
  color: "#44749D",
  weight: 2,
  fillColor: "#5A9FDA",
  fillOpacity: 0.5
};


// Componente para manejar el evento de doble clic
const DoubleClickListener = () => {
  const map = useMap();

  useEffect(() => {
    const handleDoubleClick = (event) => {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      console.log(event)
      console.log("Doble clic en:", `Lat: ${lat}, Lng: ${lng}`);
    };

    // Escuchar el evento de doble clic
    map.on('dblclick', handleDoubleClick);

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      map.off('dblclick', handleDoubleClick);
    };
  }, [map]);

  return null;
};


// Componente para manejar el evento de clic en el GeoJSON
const GeoJSONLayer = ({ geoJson }) => {
  const map = useMap();

  useEffect(() => {
    if (!geoJson || !geoJson.features) return;

    const geoJsonLayer = L.geoJSON(geoJson, {
      onEachFeature: (feature, layer) => {
        // Al hacer clic en una característica, mostrar el popup con las propiedades
        layer.on('click', () => {
          const { properties } = feature;
          const popupContent = `
            <strong>Nombre:</strong> ${properties.Nombre} <br/>
            <strong>Centro:</strong> ${properties.Centro} <br/>
            <strong>Edificio:</strong> ${properties.EDIFICIO} <br/>
            <strong>Uso:</strong> ${properties.Uso} <br/>
            <strong>Superficie:</strong> ${properties.SUPERFICIE} m² <br/>
            <strong><a href="https://${properties.Link}" target="_blank">Más información</a></strong> <br/>
            <img src="${properties.FOTO_360}" alt="Foto 360" style="width: 100px; height: auto;" /> <br/>
            <img src="${properties.FOTO_PLANA}" alt="Foto plana" style="width: 100px; height: auto;" />
          `;

          // Mostrar el popup con la información
          layer.bindPopup(popupContent).openPopup();
        });
      }
    }).addTo(map);

    // Limpiar la capa cuando el componente se desmonta
    return () => {
      map.removeLayer(geoJsonLayer);
    };
  }, [geoJson, map]);

  return null;
};


export const Home = () => {

  const [bounds, setBounds] = useState(null);



  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center justify-center gap-8">
      <MapContainer
        center={[41.683657, -0.888999]}
        maxBoundsViscosity={1.0}
        maxBounds={bounds} 
        zoom={28}
        maxZoom={30}
        zoomDelta={0.5}
        zoomSnap={0.5}
        style={{ height: "800px", width: "1200px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={dataGeoJSON} style={geoJsonStyle} />
        <FitBounds geoJson={dataGeoJSON} setBounds={setBounds} />
        {/* {bounds && <RestrictBounds bounds={bounds} />} */}
        {/* Escuchar evento de doble clic */}
        {/* <DoubleClickListener /> */}
        {/* Cargar y mostrar información del GeoJSON al hacer clic */}
        <GeoJSONLayer geoJson={dataGeoJSON} />
      </MapContainer>
    </div>
  );
};
