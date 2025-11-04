import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { subscriptionAPI } from '../api/client';
import Header from '../components/Header';

const plans = [
  { id: 'monthly', name: 'Starter', price: 'Rp 299K', period: '/month', features: ['Full access', 'Real-time monitoring', 'Email support', 'Basic analytics'] },
  { id: 'quarterly', name: 'Professional', price: 'Rp 799K', period: '/3 months', features: ['All starter features', 'Priority support', 'Advanced analytics', 'Historical data (30 days)'], popular: true },
  { id: 'annual', name: 'Enterprise', price: 'Rp 1.499K', period: '/year', features: ['All professional features', 'Unlimited devices', '24/7 support', 'Custom reports', 'Historical data (unlimited)'] },
];

export default function SubscriptionScreen() {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
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
    }
  };

  return (
    <View style={styles.container}>
      <Header subtitle="Choose Your Plan" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Subscription Plans</Text>
        <Text style={styles.subtitle}>Select the perfect plan for your needs</Text>

        {paymentUrl && (
          <View style={styles.successCard}>
            <Text style={styles.successText}>Invoice generated! Payment page opened in browser.</Text>
          </View>
        )}

        {plans.map((plan) => (
          <View key={plan.id} style={[styles.planCard, plan.popular && styles.planCardPopular]}>
            {plan.popular && <Text style={styles.popularBadge}>Most Popular</Text>}
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>{plan.price}<Text style={styles.planPeriod}>{plan.period}</Text></Text>
            <View style={styles.features}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.subscribeBtn, plan.popular && styles.subscribeBtnPopular]}
              onPress={() => handleSubscribe(plan.id)}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.subscribeText}>Subscribe Now</Text>}
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.securityCard}>
          <Text style={styles.securityTitle}>Payment Security</Text>
          <Text style={styles.securityText}>Your payment is securely processed through Xendit. We do not store your payment details.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 16, gap: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 },
  successCard: { backgroundColor: '#ecfdf5', borderColor: '#10b981', borderWidth: 1, borderRadius: 12, padding: 16 },
  successText: { color: '#059669', fontSize: 14 },
  planCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#e5e7eb', position: 'relative' },
  planCardPopular: { borderColor: '#2563eb', borderWidth: 2 },
  popularBadge: { position: 'absolute', top: -12, left: '50%', marginLeft: -50, backgroundColor: '#2563eb', color: '#ffffff', paddingVertical: 4, paddingHorizontal: 16, borderRadius: 9999, fontSize: 12, fontWeight: '600' },
  planName: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  planPrice: { fontSize: 32, fontWeight: '700', color: '#111827', marginBottom: 16 },
  planPeriod: { fontSize: 16, fontWeight: '400', color: '#6b7280' },
  features: { marginBottom: 20, gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureCheck: { color: '#10b981', fontSize: 16, fontWeight: '700' },
  featureText: { fontSize: 14, color: '#374151' },
  subscribeBtn: { backgroundColor: '#e5e7eb', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  subscribeBtnPopular: { backgroundColor: '#2563eb' },
  subscribeText: { color: '#374151', fontWeight: '600', fontSize: 16 },
  securityCard: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  securityTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
  securityText: { fontSize: 12, color: '#6b7280', lineHeight: 18 }
});

