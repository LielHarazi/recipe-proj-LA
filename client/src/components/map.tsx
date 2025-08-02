import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 32.0853,
  lng: 34.7818,
};

export default function MyMap() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyAMqtvOv4KR5HyNcNpa3NEtr3z43yiSmS4">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}
