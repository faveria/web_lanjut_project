import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      await register(email, password);
      Alert.alert('Success', 'Registration successful! Please check your email to verify your account.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our smart monitoring system</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={20} color={theme.colors.status.error} style={styles.errorIcon} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.text.disabled}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor={theme.colors.text.disabled}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.passwordVisibilityBtn} onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? "visibility-off" : "visibility"} size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor={theme.colors.text.disabled}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.passwordVisibilityBtn} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon name={showConfirmPassword ? "visibility-off" : "visibility"} size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {password.length > 0 && (
          <View style={styles.requirementContainer}>
            <View style={styles.requirementRow}>
              <Icon name={password.length >= 6 ? "check-circle" : "radio-button-unchecked"} size={16} color={password.length >= 6 ? theme.colors.status.success : theme.colors.text.disabled} />
              <Text style={[styles.requirementText, { color: password.length >= 6 ? theme.colors.status.success : theme.colors.text.disabled }]}>
                At least 6 characters
              </Text>
            </View>
          </View>
        )}

        {password && confirmPassword && (
          <View style={styles.requirementContainer}>
            <View style={styles.requirementRow}>
              <Icon name={password === confirmPassword ? "check-circle" : "radio-button-unchecked"} size={16} color={password === confirmPassword ? theme.colors.status.success : theme.colors.text.disabled} />
              <Text style={[styles.requirementText, { color: password === confirmPassword ? theme.colors.status.success : theme.colors.text.disabled }]}>
                Passwords match
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.createAccountBtn, loading && styles.createAccountBtnDisabled]} 
          onPress={onSubmit} 
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createAccountBtnText}>Create Account</Text>}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Google Signup', 'Google signup feature coming soon!')}>
            <View style={styles.googleLogoContainer}>
              <Text style={styles.googleLetter}>G</Text>
            </View>
            <Text style={styles.socialBtnText}>Sign up with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Apple Signup', 'Apple signup feature coming soon!')}>
            <View style={styles.appleLogoContainer}>
              <Text style={styles.appleLetter}>A</Text>
            </View>
            <Text style={styles.socialBtnText}>Sign up with Apple</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    paddingTop: 80,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center'
  },
  formContainer: {
    width: '100%',
    marginTop: 16,
    flex: 1
  },
  inputGroup: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.background
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary
  },
  passwordVisibilityBtn: {
    padding: 12,
    paddingRight: 16
  },
  requirementContainer: {
    marginBottom: 16
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  requirementText: {
    fontSize: theme.typography.caption.fontSize
  },
  createAccountBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    marginBottom: 20
  },
  createAccountBtnDisabled: {
    opacity: 0.6
  },
  createAccountBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: theme.typography.body.fontSize
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border
  },
  dividerText: {
    marginHorizontal: 16,
    color: theme.colors.text.secondary,
    fontWeight: '500'
  },
  socialButtonsContainer: {
    gap: 12,
    marginBottom: 20
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background
  },
  googleLogoContainer: {
    position: 'absolute',
    left: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DB4437', // Google red
    justifyContent: 'center',
    alignItems: 'center'
  },
  googleLetter: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  appleLogoContainer: {
    position: 'absolute',
    left: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000000', // Apple black
    justifyContent: 'center',
    alignItems: 'center'
  },
  appleLetter: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  socialBtnText: {
    color: theme.colors.text.primary,
    fontWeight: '500',
    fontSize: theme.typography.body.fontSize
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20
  },
  signInText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary
  },
  signInLink: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
    fontWeight: '600'
  },
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: theme.borderRadius.m,
    padding: 12,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center'
  },
  errorIcon: {
    marginRight: 8
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: theme.typography.body.fontSize,
    flex: 1
  }
});