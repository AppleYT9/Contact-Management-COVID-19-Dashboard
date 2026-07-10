import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useCovidCountries } from '../hooks/useCovidData';
import { Loader2, AlertCircle } from 'lucide-react';

export const MapsPage: React.FC = () => {
  const { data: countriesData, isLoading, error } = useCovidCountries();

  const validCountries = useMemo(() => {
    if (!countriesData) return [];
    return countriesData.filter(
      (c) => c.countryInfo && typeof c.countryInfo.lat === 'number' && typeof c.countryInfo.long === 'number'
    );
  }, [countriesData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="text-xs font-semibold">Loading interactive map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-rose-50 border border-rose-100 p-6 rounded-xl text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">Failed to load Map</h3>
          <p className="text-xs text-slate-500">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-10rem)] select-none">
      
      <div className="flex-1 rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative bg-white">
        <MapContainer
          center={[25, 0]}
          zoom={2.2}
          className="h-full w-full"
          scrollWheelZoom={true}
          style={{ minHeight: '400px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {validCountries.map((c) => {
            const casesLog = Math.log(c.cases);
            const radius = Math.min(Math.max(casesLog * 1.5, 4), 22);

            return (
              <CircleMarker
                key={c.country}
                center={[c.countryInfo.lat, c.countryInfo.long]}
                radius={radius}
                pathOptions={{
                  color: '#e11d48',
                  fillColor: '#e11d48',
                  fillOpacity: 0.35,
                  weight: 1,
                }}
              >
                <Popup>
                  <div className="p-1 space-y-2.5 font-sans text-xs">
                    <div className="flex items-center space-x-2 pb-1.5 border-b border-slate-100">
                      <img
                        src={c.countryInfo.flag}
                        alt={`${c.country} flag`}
                        className="w-5 h-3 rounded object-cover shadow-sm shrink-0"
                      />
                      <h4 className="font-bold text-slate-800 text-xs">{c.country}</h4>
                    </div>

                    <div className="space-y-1 text-slate-600">
                      <div className="flex justify-between space-x-6">
                        <span>Total Cases:</span>
                        <span className="font-semibold text-slate-900">{c.cases.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between space-x-6">
                        <span>Active:</span>
                        <span className="font-semibold text-amber-600">{c.active.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between space-x-6">
                        <span>Recovered:</span>
                        <span className="font-semibold text-emerald-600">{c.recovered.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between space-x-6">
                        <span>Deaths:</span>
                        <span className="font-semibold text-rose-600">{c.deaths.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
