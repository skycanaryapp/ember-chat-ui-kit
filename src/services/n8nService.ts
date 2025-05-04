
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
    console.log("Sending request to n8n webhook:", { message, conversationId, userId });
    
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
      console.error(`Network error: ${response.status} ${response.statusText}`);
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Debug the response
    console.log("Received response from n8n webhook:", data);
    
    // Check if we have a message in the expected format
    if (data && Array.isArray(data) && data.length > 0 && data[0].output) {
      return data[0].output;
    } else if (data && typeof data.message === 'string') {
      return data.message;
    } else {
      console.error("Unexpected response format:", data);
      throw new Error("The AI service returned an unexpected response format");
    }
  } catch (error) {
    console.error('Error sending message to n8n webhook:', error);
    throw new Error('Failed to get a response from the AI. Please try again later.');
  }
}
