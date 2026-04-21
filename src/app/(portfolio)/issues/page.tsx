'use client';
import { useState } from 'react';
import { type FormEvent } from 'react';
import { usePortfolioContext } from '@/contexts/portfolio-context';
import { renderIssuesPage } from '@/components/pages/issues';
import { postAction } from '@/utils/api';

export default function IssuesPage() {
  const { issuesUrl, sanitizedConfig } = usePortfolioContext();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactBody, setContactBody] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactMessage, setContactMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const submitContactForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sanitizedConfig.contact.endpoint) {
      setContactMessage({
        type: 'error',
        text: 'Contact endpoint is not configured.',
      });
      return;
    }

    try {
      setContactLoading(true);
      setContactMessage(null);

      await postAction(sanitizedConfig.contact.endpoint, {
        fullName: contactName,
        email: contactEmail,
        message: contactBody,
      });

      setContactName('');
      setContactEmail('');
      setContactBody('');
      setContactMessage({
        type: 'success',
        text: 'Message sent successfully.',
      });
    } catch {
      setContactMessage({
        type: 'error',
        text: 'Failed to send message. Please try again later.',
      });
    } finally {
      setContactLoading(false);
    }
  };

  return renderIssuesPage({
    issuesUrl,
    submitContactForm,
    contactLoading,
    contactEmail,
    contactBody,
    contactName,
    contactMessage,
    setContactBody,
    setContactEmail,
    setContactName,
    endpoint: sanitizedConfig.contact.endpoint,
  });
}
