// Utility function to map planType (e.g., 'Standard', 'Duo', 'Premium') to service name (e.g., 'Netflix', 'Hotstar')
// Uses the subscriptions array from Plans.jsx
const subscriptions = [
  { name: 'Netflix', plans: ['Standard', 'Premium'] },
  { name: 'Spotify', plans: ['Duo', 'Family'] },
  { name: 'Prime Video', plans: ['Monthly', 'Annual'] },
  { name: 'JioHotstar', plans: ['Super (3 Months)', 'Premium (Monthly)', 'Premium (Annual)'] },
  { name: 'YouTube Premium', plans: ['Two-person', 'Family'] },
  { name: 'Canva Pro', plans: ['Pro'] },
  { name: 'Microsoft 365', plans: ['Family (Annual)'] }
];

export function getServiceNameFromPlanType(planType) {
  for (const sub of subscriptions) {
    if (sub.plans.some(plan => planType && planType.includes(plan))) {
      return sub.name;
    }
  }
  // fallback to the planType itself if not found
  return planType;
}
