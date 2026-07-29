import type { APIRoute } from 'astro';

const API_TOKEN = import.meta.env.BASEROW_FORM_TOKEN;
const TABLE_ID = import.meta.env.BASEROW_TABLE_ID;
const BASEROW_API_URL = 'https://api.baserow.io/api/database/rows/table';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, message: 'All fields are required.' }),
        { status: 400 }
      );
    }

    const baserowPayload = {
      Name: name,
      Email: email,
      Message: message,
    };

    const response = await fetch(`${BASEROW_API_URL}/${TABLE_ID}/?user_field_names=true`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(baserowPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Baserow API Error:', errorData);
      throw new Error(`Baserow API error: ${response.statusText}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Your message was sent successfully!' }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Form submission error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'There was an error submitting your form. Please try again.' }),
      { status: 500 }
    );
  }
};