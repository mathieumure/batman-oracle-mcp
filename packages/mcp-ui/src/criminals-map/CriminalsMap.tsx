import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import styles from './CriminalsMap.module.css';

export type LocatedCriminal = {
  name: string;
  picture: string;
  lat: number;
  lng: number;
};

export type MapCenter = {
  lat: number;
  lng: number;
};

type Props = {
  city: string;
  center: MapCenter;
  criminals: Array<LocatedCriminal>;
};

const criminalIcon = (criminal: LocatedCriminal) =>
  divIcon({
    className: styles.marker,
    html: `<img src="${criminal.picture}" alt="${criminal.name}" />`,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  });

export const CriminalsMap = ({ city, center, criminals }: Props) => {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Gotham Watch — {city}</h1>
      <MapContainer center={[center.lat, center.lng]} zoom={14} className={styles.map}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />
        {criminals.map((criminal) => (
          <Marker key={criminal.name} position={[criminal.lat, criminal.lng]} icon={criminalIcon(criminal)} />
        ))}
      </MapContainer>
    </div>
  );
};
