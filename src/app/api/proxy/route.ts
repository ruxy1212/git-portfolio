import { NextResponse } from 'next/server';
import axios, { type AxiosError } from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, method, data, headers: clientHeaders } = body;

    const secureHeaders = {
      ...clientHeaders,
      'Content-Type': 'application/json',
    };

    let finalUrl =
      url.startsWith('https://') ||
      url.startsWith('http://') ||
      url.startsWith('/')
        ? url
        : `/${url}`;

    finalUrl = url.startsWith('/')
      ? `${process.env.NEXT_APP_URL || 'http://localhost:3000'}${url}`
      : url;

    const response = await axios({
      method: method || 'GET',
      url: finalUrl,
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
