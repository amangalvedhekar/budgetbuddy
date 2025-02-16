import React, {useContext, useEffect, useRef} from 'react';
import {ToastContext} from './ToastProvider';
import {
  Text,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
} from 'react-native';
const styles = StyleSheet.create({
  toast: {
    borderRadius: 24,
    marginHorizontal: 16,
    padding: 4,
    position: 'absolute',
    top: 0,
    zIndex: 2,
    right: 0,
    left: 0,
    backgroundColor: 'purple',

  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 52,

  },
  toastMessage: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.26,
    marginHorizontal: 10,
  },
});
export const Toast = () => {
  const {toast, hide} = useContext(ToastContext);
  const translateYRef = useRef(new Animated.Value(-100));

  useEffect(() => {
    if (toast.visible) {
      Animated.timing(translateYRef.current, {
        duration: 300,
        easing: Easing.ease,
        toValue: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateYRef.current, {
        duration: 450,
        easing: Easing.ease,
        toValue: -100,
        useNativeDriver: true,
      }).start();
    }
  }, [toast]);

  return (
<>
  {toast.visible && (    <Animated.View
    style={[
      styles.toast,
      {transform: [{translateY: translateYRef.current}]},
    ]}>
    <Pressable onPress={hide} style={styles.content}>
      <Text style={styles.toastMessage}> {toast.message}</Text>
    </Pressable>
  </Animated.View>)}
</>
  );
};

export default Toast;