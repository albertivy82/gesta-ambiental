import { useEffect, useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { TouchableOpacity, View, ScrollView} from 'react-native';
import { imovelBody } from '../../../shared/types/imovelBody';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import Text from '../../../shared/components/text/Text';
import { Icon } from '../../../shared/components/icon/Icon';
import { coordenadasBody } from '../../../shared/types/coordenadaBody';
import { EscolaType } from '../../../shared/types/EscolaType';
import { PostoType } from '../../../shared/types/postoTypes';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';



