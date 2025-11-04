import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { subscriptionAPI } from '../api/client';
import Header from '../components/Header';
import { theme } from '../theme';

const plans = [
  { 
    id: 'monthly', 
    name: 'Starter', 
    price: 'Rp 299K', 
    period: '/month', 
    features: ['Full access to all features', 'Real-time monitoring', 'Email support', 'Basic analytics'] 
  },
  { 
    id: 'quarterly', 
    name: 'Professional', 
    price: 'Rp 799K', 
    period: '/3 months', 
    features: ['All starter features', 'Priority support', 'Advanced analytics', 'Historical data (30 days)'], 
    popular: true 
  },
  { 
    id: 'annual', 
    name: 'Enterprise', 
    price: 'Rp 1.499K', 
    period: '/year', 
    features: ['All professional features', 'Unlimited devices', '24/7 premium support', 'Custom reports', 'Historical data (unlimited)'] 
  },
];

export default function SubscriptionScreen() {
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    setLoadingPlan(planId);
    try {
      const res = await subscriptionAPI.createInvoice(planId);
      if (res.data.success && res.data.data.invoiceUrl) {
        setPaymentUrl(res.data.data.invoiceUrl);
        await Linking.openURL(res.data.data.invoiceUrl);
      }
    } catch (e: any) {
      console.error('Error creating invoice:', e);
    } finally {
      setLoading(false);
      setLoadingPlan(null);
    }
  };

  return (
    <View style={styles.container}>
      <Header subtitle="Choose Your Plan" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Subscription Plans</Text>
          <Text style={styles.subtitle}>Select the perfect plan for your needs</Text>
        </View>

        {paymentUrl && (
          <View style={styles.successCard}>
            <Text style={styles.successText}>Invoice generated! Payment page opened in browser.</Text>
          </View>
        )}

        {plans.map((plan) => (
          <View key={plan.id} style={[styles.planCard, plan.popular && styles.popularPlan]}>
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>Most Popular</Text>
              </View>
            )}
            
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}<Text style={styles.planPeriod}>{plan.period}</Text></Text>
            </View>
            
            <Text style={styles.featureTitle}>Features:</Text>
            <View style={styles.features}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity
              style={[styles.subscribeBtn, plan.popular && styles.popularSubscribeBtn]}
              onPress={() => handleSubscribe(plan.id)}
              disabled={loading}
            >
              {loading && loadingPlan === plan.id ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.subscribeText}>Subscribe Now</Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
        
        <View style={styles.securityCard}>
          <Text style={styles.securityTitle}>Payment Security</Text>
          <Text style={styles.securityText}>Your payment is securely processed through Xendit. We do not store your payment details.</Text>
        </View>
        
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>Need help choosing a plan?</Text>
          <Text style={styles.footerSubtext}>Contact support@hyyume.com for assistance</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  content: { 
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.m
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.l
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: theme.colors.text.primary, 
    textAlign: 'center', 
    marginBottom: theme.spacing.xs 
  },
  subtitle: { 
    fontSize: theme.typography.body.fontSize, 
    color: theme.colors.text.secondary, 
    textAlign: 'center' 
  },
  successCard: { 
    backgroundColor: '#ecfdf5', 
    borderColor: theme.colors.status.success, 
    borderWidth: 1, 
    borderRadius: theme.borderRadius.m, 
    padding: theme.spacing.m,
    alignItems: 'center'
  },
  successText: { 
    color: theme.colors.status.success, 
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center'
  },
  planCard: { 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.borderRadius.l, 
    padding: theme.spacing.l, 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    position: 'relative',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  popularPlan: {
    borderColor: theme.colors.primary,
    borderWidth: 2
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 9999,
    zIndex: 1
  },
  popularBadgeText: {
    color: '#ffffff',
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600'
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.m
  },
  planName: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: theme.colors.text.primary, 
    marginBottom: theme.spacing.s
  },
  planPrice: { 
    fontSize: 32, 
    fontWeight: '700', 
    color: theme.colors.text.primary 
  },
  planPeriod: { 
    fontSize: theme.typography.body.fontSize, 
    fontWeight: '400', 
    color: theme.colors.text.secondary 
  },
  featureTitle: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.s
  },
  features: { 
    marginBottom: theme.spacing.m,
    gap: theme.spacing.s
  },
  featureRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    gap: theme.spacing.s 
  },
  featureCheck: { 
    color: theme.colors.status.success, 
    fontSize: theme.typography.body.fontSize, 
    fontWeight: '700',
    marginTop: 2
  },
  featureText: { 
    fontSize: theme.typography.body.fontSize, 
    color: theme.colors.text.primary,
    flex: 1 
  },
  subscribeBtn: { 
    backgroundColor: theme.colors.background, 
    paddingVertical: 16, 
    borderRadius: theme.borderRadius.m, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  popularSubscribeBtn: { 
    backgroundColor: theme.colors.primary 
  },
  subscribeText: { 
    color: '#ffffff', 
    fontWeight: '600', 
    fontSize: theme.typography.body.fontSize 
  },
  securityCard: { 
    backgroundColor: theme.colors.background, 
    borderRadius: theme.borderRadius.m, 
    padding: theme.spacing.m, 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    alignItems: 'center'
  },
  securityTitle: { 
    fontSize: theme.typography.h3.fontSize, 
    fontWeight: '600', 
    color: theme.colors.text.primary, 
    marginBottom: theme.spacing.s 
  },
  securityText: { 
    fontSize: theme.typography.caption.fontSize, 
    color: theme.colors.text.secondary, 
    lineHeight: 18,
    textAlign: 'center'
  },
  footerNote: {
    alignItems: 'center',
    paddingTop: theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  footerText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs
  },
  footerSubtext: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center'
  }
});