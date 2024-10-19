import React from 'react';
import { Button } from '@/components/button';
import { useMutation } from '@tanstack/react-query';
import { customFetch, HttpMethod } from '@/common/custom-fetcher';
import { Spinner } from '@/components/spinner';

interface ImpersonateButtonProps {
  userId: number;
}

export function ImpersonateButton({ userId }: ImpersonateButtonProps) {
  const impersonateMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await customFetch('/api/auth/impersonate', {
        method: HttpMethod.POST,
        body: JSON.stringify({ userId }),
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.redirectUrl) {
        window.open(data.redirectUrl, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error('Impersonation failed: No redirect URL received');
      }
    },
    onError: () => {
      throw new Error('Failed to impersonate user. Please try again.');
    },
  });

  const handleImpersonate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    impersonateMutation.mutate(userId);
  };

  return (
    <Button
      onClick={handleImpersonate}
      disabled={impersonateMutation.isPending}
      variant={'outline'}
      size="sm"
    >
      {impersonateMutation.isPending ? <Spinner /> : 'Impersonate'}
    </Button>
  );
}
