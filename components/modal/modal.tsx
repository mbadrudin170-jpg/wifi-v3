// Path: ~/wifi-v3/components/modal/modal.tsx
import { Dimensions, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ModalDropDownProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  data: any[];
  renderItem: ({ item }: { item: any }) => React.ReactElement;
  position?: 'top' | 'center' | 'bottom';
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
}

export default function ModalDropDown({
  visible,
  onClose,
  title,
  data,
  renderItem,
  position = 'center',
  animationType = 'fade',
  transparent = true,
}: ModalDropDownProps) {
  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return { justifyContent: 'flex-start' as const };
      case 'bottom':
        return { justifyContent: 'flex-end' as const };
      case 'center':
      default:
        return { justifyContent: 'center' as const };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <Pressable style={[styles.modalOverlay, getPositionStyle()]} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          {/* Header dengan judul dan tombol close */}
          <View style={styles.modalHeader}>
            {title && <Text style={styles.modalTitle}>{title}</Text>}
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {/* Konten dinamis dengan FlatList */}
          <FlatList
            style={styles.modalBody}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.defaultContent}>
                <Text style={styles.defaultText}>No content provided</Text>
              </View>
            }
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: height * 0.7,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  modalBody: {
    maxHeight: height * 0.5,
  },
  defaultContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    padding: 16,
  },
  defaultText: {
    color: '#999',
    fontSize: 14,
  },
});
