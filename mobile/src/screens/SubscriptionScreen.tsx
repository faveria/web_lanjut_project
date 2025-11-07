import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { subscriptionAPI } from '../api/client';
import Header from '../components/Header';
import { useDarkMode } from '../theme/DarkModeContext';
import { useDynamicStyles } from '../hooks/useDynamicStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const plans = [
  { 
    id: 'monthly', 
    name: 'Starter', 
    monthlyPrice: 'Rp 299K', 
    yearlyPrice: 'Rp 2.999K', 
    period: '/month', 
    yearlyPeriod: '/year',
    features: ['Full access to all features', 'Real-time monitoring', 'Email support', 'Basic analytics'],
    popular: false
  },
  { 
    id: 'quarterly', 
    name: 'Professional', 
    monthlyPrice: 'Rp 799K', 
    yearlyPrice: 'Rp 6.999K', 
    period: '/3 months', 
    yearlyPeriod: '/year',
    features: ['All starter features', 'Priority support', 'Advanced analytics', 'Historical data (30 days)'],
    popular: true
  },
  { 
    id: 'annual', 
    name: 'Enterprise', 
    monthlyPrice: 'Rp 1.499K', 
    yearlyPrice: 'Rp 12.999K', 
    period: '/year', 
    yearlyPeriod: '/year',
    features: ['All professional features', 'Unlimited devices', '24/7 support', 'Custom reports', 'Historical data (unlimited)'],
    popular: false
  },
];

export default function SubscriptionScreen() {
  const { theme } = useDarkMode();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly'); // Default to monthly
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const styles = useDynamicStyles(createStyles);

  const handleSubscribe = async (planId: string) => {
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

        {/* Billing Cycle Toggle */}
        <View style={styles.billingToggleContainer}>
          <TouchableOpacity 
            style={[
              styles.billingToggleOption, 
              billingCycle === 'monthly' && styles.billingToggleOptionActive
            ]}
            onPress={() => setBillingCycle('monthly')}
          >
            <Text style={[
              styles.billingToggleText,
              billingCycle === 'monthly' && styles.billingToggleTextActive
            ]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.billingToggleOption, 
              billingCycle === 'yearly' && styles.billingToggleOptionActive
            ]}
            onPress={() => setBillingCycle('yearly')}
          >
            <Text style={[
              styles.billingToggleText,
              billingCycle === 'yearly' && styles.billingToggleTextActive
            ]}>Annual</Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>Save 20%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {paymentUrl && (
          <View style={styles.successCard}>
            <Text style={styles.successText}>Invoice generated! Payment page opened in browser.</Text>
          </View>
        )}

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <View key={plan.id} style={[
              styles.planCard, 
              plan.popular && styles.popularPlanCard
            ]}>
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
              </View>
              
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </Text>
                <Text style={styles.period}>
                  {billingCycle === 'monthly' ? plan.period : plan.yearlyPeriod}
                </Text>
              </View>
              
              <View style={styles.features}>
                {plan.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <Icon name="check-circle" size={16} color={theme.colors.status.success} style={styles.featureIcon} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.ctaContainer}>
                {plan.popular ? (
                  <TouchableOpacity
                    style={styles.primaryCtaButton}
                    onPress={() => handleSubscribe(plan.id)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.primaryCtaText}>Subscribe Now</Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.secondaryCtaButton}
                    onPress={() => handleSubscribe(plan.id)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? (
                      <ActivityIndicator color={theme.colors.primary} />
                    ) : (
                      <Text style={styles.secondaryCtaText}>
                        {plan.name === 'Starter' ? 'Choose Starter' : 'Choose Enterprise'}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

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

const createStyles = (theme: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  content: { 
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.xl
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.m
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
    textAlign: 'center', 
    marginBottom: theme.spacing.l 
  },
  billingToggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.l,
    padding: 4,
    marginBottom: theme.spacing.l,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  billingToggleOption: {
    flex: 1,
    padding: theme.spacing.m,
    alignItems: 'center',
    borderRadius: theme.borderRadius.m,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  billingToggleOptionActive: {
    backgroundColor: theme.colors.primary,
  },
  billingToggleText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    fontWeight: '500'
  },
  billingToggleTextActive: {
    color: '#ffffff',
    fontWeight: '600'
  },
  saveBadge: {
    backgroundColor: theme.colors.status.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
    marginLeft: 8
  },
  saveBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600'
  },
  successCard: { 
    backgroundColor: `${theme.colors.status.success}20`, 
    borderColor: theme.colors.status.success, 
    borderWidth: 1, 
    borderRadius: theme.borderRadius.m, 
    padding: theme.spacing.m,
    alignItems: 'center',
    marginBottom: theme.spacing.m
  },
  successText: { 
    color: theme.colors.status.success, 
    textAlign: 'center', 
    fontSize: theme.typography.body.fontSize,
    lineHeight: 18
  },
  plansContainer: {
    gap: theme.spacing.m,
    marginBottom: theme.spacing.m
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
  popularPlanCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2
  },
  popularBadge: { 
    position: 'absolute', 
    top: -10, 
    left: '50%', 
    transform: [{ translateX: -50 }], 
    backgroundColor: theme.colors.primary, 
    color: '#ffffff', 
    fontSize: 10, 
    fontWeight: '700', 
    paddingHorizontal: 16, 
    paddingVertical: 4, 
    borderRadius: 9999, 
    zIndex: 1 
  },
  popularBadgeText: {
    color: '#ffffff',
    fontSize: 10,
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
  priceContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.m
  },
  price: { 
    fontSize: 32, 
    fontWeight: '700', 
    color: theme.colors.text.primary,
    marginBottom: 4
  },
  period: { 
    fontSize: theme.typography.caption.fontSize, 
    color: theme.colors.text.secondary 
  },
  features: { 
    marginBottom: theme.spacing.l,
    gap: theme.spacing.s
  },
  featureRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    gap: theme.spacing.s 
  },
  featureIcon: {
    marginTop: 2
  },
  featureText: { 
    fontSize: theme.typography.body.fontSize, 
    color: theme.colors.text.primary,
    flex: 1 
  },
  ctaContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.s
  },
  primaryCtaButton: { 
    backgroundColor: theme.colors.primary, 
    paddingVertical: 16, 
    paddingHorizontal: 32,
    borderRadius: theme.borderRadius.m, 
    alignItems: 'center',
    minWidth: '80%'
  },
  primaryCtaText: { 
    color: '#ffffff', 
    fontWeight: '600', 
    fontSize: theme.typography.body.fontSize 
  },
  secondaryCtaButton: { 
    backgroundColor: 'transparent', 
    paddingVertical: 16, 
    paddingHorizontal: 32,
    borderRadius: theme.borderRadius.m, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    minWidth: '80%'
  },
  secondaryCtaText: { 
    color: theme.colors.primary, 
    fontWeight: '600', 
    fontSize: theme.typography.body.fontSize 
  },
  securityCard: { 
    backgroundColor: theme.colors.background, 
    borderRadius: theme.borderRadius.m, 
    padding: theme.spacing.m, 
    borderWidth: 1, 
    borderColor: theme.colors.border,
    alignItems: 'center',
    marginBottom: theme.spacing.m
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