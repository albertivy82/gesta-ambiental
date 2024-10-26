import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

const useScreenDimensions = () => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = ({ window }: { window: ScaledSize }) => {
      setScreenData(window);
    };

    // Adiciona o listener para mudanças de orientação
    const subscription = Dimensions.addEventListener('change', onChange);

    // Remove o listener quando o componente é desmontado
    return () => subscription.remove();
  }, []);

  return screenData;
};

export default useScreenDimensions;
