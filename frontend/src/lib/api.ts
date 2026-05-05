const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface ContactRequest {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export async function submitContactForm(data: ContactRequest): Promise<ContactResponse> {
  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch {
    // Fallback: open WhatsApp with message
    const text = `Hola! Soy ${data.name}. ${data.message}. Mi email: ${data.email}, Tel: ${data.phone}`;
    window.open(`https://wa.me/573150533698?text=${encodeURIComponent(text)}`, '_blank');
    return { success: true, message: 'Redirected to WhatsApp' };
  }
}
