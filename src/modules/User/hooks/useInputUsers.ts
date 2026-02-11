import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { grupoEnum } from "../../../enums/grupo.enum";
import { removeSpecialCharacters } from "../../../shared/functions/characters";
import { connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { validateCpf } from "../../../shared/functions/cpf";
import { UserInput } from "../../../shared/types/userInput";

export const DEFAULT_CREATE_USER: UserInput = {
  nome: "",
  matricula: "",
  email: "",
  cpf: "",
  grupo: null,
};

export const FIELD_LABEL: Partial<Record<keyof UserInput, string>> = {
  nome: "nome",
  matricula: "matrícula, com 8 dígitos",
  email: "e-mail",
  cpf: "cpf, com 11 dígitos",
  grupo: "grupo",
};

export const validateUser = (data: UserInput) => {
  const errors: { field: keyof UserInput; message: string }[] = [];

  // obrigatórios
  (["nome", "matricula", "email", "cpf", "grupo"] as (keyof UserInput)[]).forEach((f) => {
    const v = data[f] as any;
    if (v === "" || v === undefined || v === null) {
      errors.push({ field: f, message: `Preencha ${FIELD_LABEL[f]}.` });
    }
  });

  // matrícula: exatamente 7 dígitos
  if (data.matricula) {
    const onlyDigits = data.matricula.replace(/\D/g, "");
    if (onlyDigits.length !== 8) {
      errors.push({
        field: "matricula",
        message: "A matrícula deve ter exatamente 8 dígitos.",
      });
    }
  }

  // cpf: 11 dígitos e válido
  if (data.cpf) {
    const onlyDigits = data.cpf.replace(/\D/g, "");
    if (onlyDigits.length !== 11) {
      errors.push({
        field: "cpf",
        message: "O CPF deve ter 11 dígitos (apenas números).",
      });
    } else if (!validateCpf(onlyDigits)) {
      errors.push({
        field: "cpf",
        message: "CPF inválido.",
      });
    }
  }

  // e-mail simples
  if (data.email) {
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(data.email.trim())) {
      errors.push({
        field: "email",
        message: "Informe um e-mail válido.",
      });
    }
  }

  // grupo não pode ser vazio
  if (data.grupo === "" || data.grupo === null) {
    errors.push({
      field: "grupo",
      message: "Selecione um grupo.",
    });
  }

  const missingFieldLabels = Array.from(
    new Set(
      errors
        .map((e) => FIELD_LABEL[e.field])
        .filter(Boolean)
    )
  );

  return {
    isValid: errors.length === 0,
    errors,
    missingFieldLabels,
  };
};

const formatUserData = (user: UserInput) => {
  // cria uma cópia pra não mutar o estado
  const cpfOnly = removeSpecialCharacters(user.cpf);

  const grupoIdMapping: Record<string, number> = {
    ADMINISTRADOR: 1,
    USUARIO: 2,
  };

  const grupoId = user.grupo ? grupoIdMapping[user.grupo] ?? 0 : 0;

  return {
    nome: user.nome,
    matricula: user.matricula,
    email: user.email,
    cpf: cpfOnly,
    grupo: { id: grupoId },
  };
};

export const useInputUsers = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [novoUsuario, setUsuario] = useState<UserInput>(DEFAULT_CREATE_USER);

  // valida sempre que mudar
  useEffect(() => {
    const { isValid } = validateUser(novoUsuario);
    setDisabled(!isValid);
  }, [novoUsuario]);

  const sendUser = async () => {
    // aqui também valida, pra garantir
    const result = validateUser(novoUsuario);
    if (!result.isValid) {
      // deixa a tela decidir como exibir
      throw new Error("VALIDATION_ERROR");
    }

    const formattedUser = formatUserData(novoUsuario);
    await connectionAPIPost("http://192.168.100.28:8080/usuario", formattedUser);
    navigation.navigate("Users");
  };

  const UpdateUser = async (id: number) => {
    const result = validateUser(novoUsuario);
    if (!result.isValid) {
      throw new Error("VALIDATION_ERROR");
    }

    const formattedUser = formatUserData(novoUsuario);
    await connectionAPIPut(`http://192.168.100.28:8080/usuario/${id}`, formattedUser);
    navigation.navigate("Users");
  };

  const handleOnChangeInput = (
    value: NativeSyntheticEvent<TextInputChangeEventData> | string,
    name: keyof UserInput
  ) => {
    const newValue = typeof value === "string" ? value : value.nativeEvent?.text || "";

    setUsuario((currentUser) => ({
      ...currentUser,
      [name]: newValue,
    }));
  };

  const handleGrupoChange = (grupo: grupoEnum | "" | null) => {
    setUsuario((currentGrupo) => ({
      ...currentGrupo,
      grupo,
    }));
  };

  return {
    handleOnChangeInput,
    novoUsuario,
    sendUser,
    disabled,
    UpdateUser,
    handleGrupoChange,
    validateUser, 
  };
};
