import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { theme } from '../../themes/theme';
import { Icon } from '../icon/Icon';
import Text from '../text/Text';
import { textTypes } from '../text/textTypes';
import Input from './input';
import { LOCATION_INDISPONIVEL } from '../constants/location';

interface LocationInputProps {
  onLocationChange: (latitude: string, longitude: string) => void;
}



const LocationInput: React.FC<LocationInputProps> = ({ onLocationChange }) => {
  const [latitude, setLatitude] = useState(LOCATION_INDISPONIVEL);
  const [longitude, setLongitude] = useState(LOCATION_INDISPONIVEL);
  const [loading, setLoading] = useState(false);

  const updateLocation = (lat: string, lon: string) => {
    setLatitude(lat);
    setLongitude(lon);
    onLocationChange(lat, lon);
  };

  const getLocation = () => {
    if (loading) return; // evita spam/duplo clique
    setLoading(true);

    Geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        const lat = String(position.coords.latitude);
        const lon = String(position.coords.longitude);
        updateLocation(lat, lon); // ✅ substitui "Indisponível"
      },
      (error) => {
        setLoading(false);
        // ✅ não prejudica nada: continua "Indisponível"
        // Se você NÃO quer alert ao abrir, dá pra controlar com flag (abaixo).
        Alert.alert('Não foi possível obter a localização', error.message);
      },
      { enableHighAccuracy: true, timeout: 60000, maximumAge: 3600000, distanceFilter: 0 }
    );
  };

  useEffect(() => {
    Geolocation.requestAuthorization?.();

    // ✅ tenta automaticamente ao abrir
    // (se falhar, não prejudica: "Indisponível" já está lá)
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ marginBottom: 20 }}>
      <Input
        value={latitude}
        placeholder="Latitude"
        margin="15px 10px 30px 5px"
        title="Latitude"
        editable={false}
        selectTextOnFocus={false}
      />

      <Input
        value={longitude}
        placeholder="Longitude"
        margin="15px 10px 30px 5px"
        title="Longitude"
        editable={false}
        selectTextOnFocus={false}
      />

      <TouchableOpacity
        onPress={getLocation}
        disabled={loading}
        style={{
          padding: 10,
          backgroundColor: '#E6E8FA',
          borderRadius: 2,
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.mainTheme.black} />
          ) : (
            <Icon size={30} name="location2" color={theme.colors.mainTheme.black} />
          )}
          <Text
            margin="0px 0px 0px 0px"
            color={theme.colors.mainTheme.black}
            type={textTypes.PARAGRAPH_LIGHT}
          >
            Atualizar localização
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LocationInput;
