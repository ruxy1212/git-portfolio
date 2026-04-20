import { NextResponse } from 'next/server';
import axios, { type AxiosError } from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, method, data, headers: clientHeaders } = body;

    // Add your secret keys here - they are never seen by the browser
    const secureHeaders = {
      ...clientHeaders,
      Authorization: `Bearer ${process.env.MY_SECRET_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const response = await axios({
      method: method || 'GET',
      url: url,
      data: data,
      headers: secureHeaders,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    return NextResponse.json(
      { error: axiosError.response?.data || 'Internal Server Error' },
      { status: axiosError.response?.status || 500 },
    );
  }
}
