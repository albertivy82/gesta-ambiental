import { TouchableOpacity, View, Modal, Text, StyleSheet } from "react-native";


// Definição da interface para as propriedades
interface ConfirmacaoModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onConfirm: () => void;
}

export const ConfirmacaoModal = ({ modalVisible, setModalVisible, onConfirm }: ConfirmacaoModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>A alteração dos registros vai apagar os atuais. Deseja continuar?</Text>
          <TouchableOpacity
            onPress={onConfirm}
            style={[styles.button, styles.buttonConfirm]}
          >
            <Text style={styles.textStyle}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={[styles.button, styles.buttonCancel]}
          >
            <Text style={styles.textStyle}>Não</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Isso adiciona um fundo escuro semi-transparente
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5, // Espaço vertical entre os botões
  },
  buttonConfirm: {
    backgroundColor: "#2196F3", // Cor do botão de confirmação
  },
  buttonCancel: {
    backgroundColor: "#F44336", // Cor do botão de cancelar
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});