import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../theme/DarkModeContext';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function LoginScreen({ navigation }: any) {
  const { theme } = useDarkMode();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const styles = useDynamicStyles(createStyles);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome to HY.YUME</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
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
              placeholder="Enter your password"
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

        <TouchableOpacity style={styles.forgotPasswordBtn} onPress={() => Alert.alert('Forgot Password', 'Please contact support or use the reset link sent to your email.')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.signInBtn, loading && styles.signInBtnDisabled]} 
          onPress={onSubmit} 
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signInBtnText}>Sign In</Text>}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Google Login', 'Google login feature coming soon!')}>
            <View style={styles.googleLogoContainer}>
              <Text style={styles.googleLetter}>G</Text>
            </View>
            <Text style={styles.socialBtnText}>Sign in with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Apple Login', 'Apple login feature coming soon!')}>
            <View style={styles.appleLogoContainer}>
              <Text style={styles.appleLetter}>A</Text>
            </View>
            <Text style={styles.socialBtnText}>Sign in with Apple</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { 
    flexGrow: 1,
    backgroundColor: theme.colors.background,
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
    backgroundColor: theme.colors.surface
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
  forgotPasswordBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    paddingVertical: 4
  },
  forgotPasswordText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary,
    fontWeight: '500'
  },
  signInBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    marginBottom: 20
  },
  signInBtnDisabled: {
    opacity: 0.6
  },
  signInBtnText: {
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
    backgroundColor: theme.colors.surface
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20
  },
  signUpText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary
  },
  signUpLink: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary,
    fontWeight: '600'
  },
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: `${theme.colors.status.error}20`, // 20% opacity
    borderWidth: 1,
    borderColor: `${theme.colors.status.error}40`, // 40% opacity
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