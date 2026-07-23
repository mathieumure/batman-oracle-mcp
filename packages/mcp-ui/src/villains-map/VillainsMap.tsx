import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import styles from './VillainsMap.module.css';

export type LocatedVillain = {
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
  villains: Array<LocatedVillain>;
};

const villainIcon = (villain: LocatedVillain) =>
  divIcon({
    className: styles.marker,
    html: `<img src="${villain.picture}" alt="${villain.name}" />`,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  });

export const VillainsMap = ({ city, center, villains }: Props) => {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Gotham Watch — {city}</h1>
      <MapContainer center={[center.lat, center.lng]} zoom={14} className={styles.map}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />
        {villains.map((villain) => (
          <Marker key={villain.name} position={[villain.lat, villain.lng]} icon={villainIcon(villain)} />
        ))}
      </MapContainer>
    </div>
  );
};
