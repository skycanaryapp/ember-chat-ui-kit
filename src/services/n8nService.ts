
/**
 * Service for interacting with the n8n AI Webhook
 */

const N8N_WEBHOOK_URL = 'https://7dzvr1i5.rpcl.app/webhook/mandaleen';

export interface ChatRequestBody {
  message: string;
  conversationId: string;
  userId?: string;
}

export async function sendChatMessage(message: string, conversationId: string, userId?: string): Promise<string> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationId,
        userId,
      } as ChatRequestBody),
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.message || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error sending message to n8n webhook:', error);
    throw new Error('Failed to get a response from the AI. Please try again.');
  }
}
