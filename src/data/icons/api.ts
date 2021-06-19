import { firestore } from 'configs/firebase';
import firebase from 'firebase';
import { Icon } from './types';

const storage = firebase.storage();

export const IconsApi = {
  getAllIcons: async (): Promise<Icon[]> => {
    const iconsRef = await firestore
      .collection('icons')
      .orderBy('updatedAt', 'desc')
      .get();

    const icons: Icon[] = iconsRef.docs.map((doc) => doc.data() as Icon);
    return icons;
  },
  uploadIcon: async (icon: Icon, image: File): Promise<void> => {
    const iconStoragePath = `icons/${icon.name}`;
    const storageRef = storage.ref();
    const imageRef = storageRef.child(iconStoragePath);
    await imageRef.put(image);
    const url = await storageRef.child(iconStoragePath).getDownloadURL();

    await firestore
      .collection('icons')
      .doc(icon.name)
      .set({
        ...icon,
        imageSrc: url,
      });
  },
  deleteIcon: async (iconName: string): Promise<void> => {
    await firestore.collection('icons').doc(iconName).delete();
  },
};
