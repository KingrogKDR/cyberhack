import { checkConsent } from './consentClient';
import { checkPolicy } from './policyClient';

export async function validateAccess(userId: string, appId: string, field: string, purpose: string) {
  const hasConsent = await checkConsent(userId, appId, field);
  if (!hasConsent) return { access: false, reason: 'Consent denied' };

  const policyAllowed = await checkPolicy(appId, field, purpose);
  if (!policyAllowed) return { access: false, reason: 'Blocked by policy' };

  return { access: true };
}
