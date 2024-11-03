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

  const getLocation = () => {
   
    Geolocation.getCurrentPosition(

      
      (position) => {
        setLoading(false);
                
        const lat = position.coords.latitude.toString();
        const lon = position.coords.longitude.toString();
        setLatitude(lat);
        setLongitude(lon);
        onLocationChange(lat, lon); // Envia as coordenadas para o formulário principal
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
    getLocation();
  }, []);

  return (
    <View style={{ marginBottom: 20 }}>
      <Input
        value={latitude}
        onChange={() => {}}
        placeholder="Latitude"
        title="Latitude"
        editable={true}
      />
      <Input
        value={longitude}
        onChange={() => {}}
        placeholder="Longitude"
        title="Longitude"
        editable={true}
      />
      
      <TouchableOpacity onPress={getLocation} style={{
        padding: 12,
        backgroundColor: '#E6E8FA',
        borderRadius: 5,
        alignItems: 'center',
       
      }}>
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
         {loading ? (
              <ActivityIndicator size="small" color={theme.colors.mainTheme.black} />
          ) : (
              <Icon size={30} name="location2" color={theme.colors.mainTheme.black} />
            )}
        <Text margin="0px 0px 0px 10px"  color={theme.colors.mainTheme.black} type={textTypes.PARAGRAPH_LIGHT}>
                atualizar localização
        </Text>
        </View>
       
       
      </TouchableOpacity>
    </View>
  );
};

export default LocationInput;
