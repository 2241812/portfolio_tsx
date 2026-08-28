export interface InquiryPayload {
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  website?: string;
}

interface InquiryResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/** Submit an inquiry without exposing the Resend credential to the browser. */
export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResponse> {
  const response = await fetch('/api/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => ({}))) as InquiryResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.error || result.message || 'The inquiry could not be sent.');
  }

  return result;
}
