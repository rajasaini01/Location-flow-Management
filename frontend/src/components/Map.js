import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '400px' };

function Map({ center, onMarkerDragEnd }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "",
    });

    if (!isLoaded) return <div>Loading map...</div>;

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
            <Marker
                position={center}
                draggable={true}
                onDragEnd={onMarkerDragEnd}
            />
        </GoogleMap>
    );
}

export default Map;
