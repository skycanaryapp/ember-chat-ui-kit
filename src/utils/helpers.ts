
/**
 * Generate a random UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Scroll to the bottom of a container with an ID
 */
export function scrollToBottom(containerId: string): void {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

/**
 * Generate a title based on message content
 */
export function generateTitle(content: string): string {
  if (!content) return 'New Conversation';
  
  const words = content.split(' ').filter(word => word.length > 3);
  const title = words.slice(0, 4).join(' ');
  
  return truncateText(title, 30) || 'New Conversation';
}
