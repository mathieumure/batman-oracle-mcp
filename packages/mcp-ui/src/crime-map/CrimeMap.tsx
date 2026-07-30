import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
import type { Crime } from '@batman/data/src/generate/crimes/crime.js';
import { criminals } from '@batman/data/criminals.ts';
import styles from './CrimeMap.module.css';

export type MapCenter = {
  lat: number;
  lng: number;
};

const fallbackPicture = 'https://i.ebayimg.com/images/g/r9sAAOSwBMNlZRCk/s-l1200.jpg';

type Props = {
  city: string;
  center: MapCenter;
  crimes: Array<Crime>;
  connectChronologically?: boolean;
};

const pictureForCrime = (crime: Crime): string => {
  if (!crime.suspect) {
    return fallbackPicture;
  }
  return criminals.find((criminal) => criminal.name === crime.suspect)?.picture ?? fallbackPicture;
};

const crimeIcon = (crime: Crime, fullMarker: boolean) => {
  if (!fullMarker) {
    return divIcon({
      className: styles.marker,
      html: `<span />`,
      iconSize: [8, 8],
      iconAnchor: [4, 4],
    });
  }

  const picture = pictureForCrime(crime);
  const label = crime.suspect ?? crime.id;
  return divIcon({
    className: styles.marker,
    html: `<img src="${picture}" alt="${label}" />`,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  });
};

export const CrimeMap = ({ city, center, crimes, connectChronologically }: Props) => {
  const [fullMarker, setFullMarker] = useState(true);
  const chronologicalPositions = connectChronologically
    ? [...crimes]
        .sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt))
        .map((crime) => [crime.location.lat, crime.location.lng] as [number, number])
    : [];

  console.log({ fullMarker });

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Gotham Watch — {city}</h1>
      <MapContainer center={[center.lat, center.lng]} zoom={14} className={styles.map}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />
        {connectChronologically && chronologicalPositions.length >= 2 && (
          <Polyline pathOptions={{ color: '#f5c518', weight: 3, opacity: 0.85 }} positions={chronologicalPositions} />
        )}
        {crimes.map((crime) => (
          <Marker
            key={crime.id}
            position={[crime.location.lat, crime.location.lng]}
            icon={crimeIcon(crime, fullMarker)}
            eventHandlers={{
              click: () => setFullMarker(!fullMarker),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};
