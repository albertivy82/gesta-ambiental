import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { theme } from '../../themes/theme';
import { Icon } from '../icon/Icon';
import Text from '../text/Text';
import { textTypes } from '../text/textTypes';
import Input from './input'; // Importe seu componente Input
import { ActivityIndicator } from 'react-native-paper';

interface LocationInputProps {
  onLocationChange: (latitude: string, longitude: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationChange }) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);

  // Atualiza os valores nos inputs e no formulário principal
  const updateLocation = (lat: string, lon: string) => {
    setLatitude(lat);
    setLongitude(lon);
    onLocationChange(lat, lon);
  };

  // Obtém a localização atual
  const getLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        const lat = position.coords.latitude.toString();
        const lon = position.coords.longitude.toString();
        updateLocation(lat, lon);
      },
      (error) => {
        setLoading(false);
        Alert.alert('Erro ao obter localização', error.message);
      },
      { enableHighAccuracy: true, timeout: 60000, maximumAge: 3600000, distanceFilter: 0 }
    );
  };

  useEffect(() => {
    Geolocation.requestAuthorization();
  }, []);

  return (
    <View style={{ marginBottom: 20 }}>
      {/* Input para Latitude */}
      <Input
        value={latitude}
        onChange={(event) => updateLocation(event.nativeEvent.text, longitude)}
        placeholder="Latitude"
        margin="15px 10px 30px 5px"
        title="Latitude"
        editable={true} // Permitir edição manual
      />
      
      {/* Input para Longitude */}
      <Input
        value={longitude}
        onChange={(event) => updateLocation(latitude, event.nativeEvent.text)}
        placeholder="Longitude"
        margin="15px 10px 30px 5px"
        title="Longitude"
        editable={true} // Permitir edição manual
      />

      {/* Botão para atualizar localização */}
      <TouchableOpacity
        onPress={getLocation}
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
