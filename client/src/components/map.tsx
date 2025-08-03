// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Temporarily disabled Google Maps functionality
// Install @react-google-maps/api package to enable this component

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function MyMap() {
  return (
    <div
      style={containerStyle}
      className="border rounded-lg flex items-center justify-center bg-gray-100"
    >
      <p className="text-gray-500">
        Map component disabled - Install Google Maps API package
      </p>
    </div>
  );
}
