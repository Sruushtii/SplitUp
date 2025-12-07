// Utility function to map planType (plan ID) to service name
// This ensures accurate mapping since plan IDs are unique across all services

// Map plan IDs to service names
const planIdToService = {
  // Netflix
  'netflix-standard': 'Netflix',
  'netflix-premium': 'Netflix',

  // Spotify
  'spotify-platinum': 'Spotify',

  // Prime Video
  'prime-monthly': 'Prime Video',
  'prime-annual': 'Prime Video',

  // JioHotstar
  'hotstar-super': 'JioHotstar',
  'hotstar-premium-monthly': 'JioHotstar',
  'hotstar-premium-annual': 'JioHotstar',

  // YouTube Premium
  'youtube-two-person': 'YouTube Premium',
  'youtube-family': 'YouTube Premium',

  // Canva Pro
  'canva-pro': 'Canva Pro',

  // Microsoft 365
  'microsoft-family': 'Microsoft 365'
};

export function getServiceNameFromPlanType(planType) {
  // Direct lookup by plan ID (most accurate)
  if (planIdToService[planType]) {
    return planIdToService[planType];
  }

  // Fallback: try to extract service from plan ID prefix
  if (planType) {
    if (planType.startsWith('netflix-')) return 'Netflix';
    if (planType.startsWith('spotify-')) return 'Spotify';
    if (planType.startsWith('prime-')) return 'Prime Video';
    if (planType.startsWith('hotstar-')) return 'JioHotstar';
    if (planType.startsWith('youtube-')) return 'YouTube Premium';
    if (planType.startsWith('canva-')) return 'Canva Pro';
    if (planType.startsWith('microsoft-')) return 'Microsoft 365';
  }

  // Last resort: return the planType itself or 'Unknown'
  return planType || 'Unknown';
}
