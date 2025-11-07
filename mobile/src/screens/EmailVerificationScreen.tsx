import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../api/client';

export default function EmailVerificationScreen({ navigation, route }: any) {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = route?.params?.token;
    const email = route?.params?.email;

    if (!token || !email) {
      setError('Invalid verification link');
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify-email?token=${token}&email=${email}`);
        if (res.data.success) {
          setSuccess(true);
          setMessage(res.data.message);
        } else {
          setError(res.data.message);
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.title}>Verifying your email...</Text>
          <Text style={styles.subtitle}>Please wait</Text>
        </>
      ) : success ? (
        <>
          <Text style={styles.icon}>✓</Text>
          <Text style={styles.title}>Email Verified!</Text>
          <Text style={styles.message}>{message || 'Your email has been verified. You can now log in.'}</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={[styles.icon, styles.errorIcon]}>✗</Text>
          <Text style={styles.title}>Verification Failed</Text>
          <Text style={styles.message}>{error || 'An error occurred during verification'}</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f9fafb' },
  icon: { fontSize: 64, color: '#10b981', marginBottom: 16 },
  errorIcon: { color: '#ef4444' },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  message: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24, paddingHorizontal: 16 },
  button: { backgroundColor: '#2563eb', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 }
});

