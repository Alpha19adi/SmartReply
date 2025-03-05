'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const token = searchParams.get('token');
                const id = searchParams.get('id');
                if (!token || !id) {
                    setVerificationStatus('error');
                    setMessage('Missing verification information');
                    return;
                }
                const response = await fetch(
                    `/api/verify-email?token=${token}&id=${id}`,
                    { method: 'GET' }
                );
                const data = await response.json();
                if (response.ok) {
                    setVerificationStatus('success');
                    setMessage(data.message);
                } else {
                    setVerificationStatus('error');
                    setMessage(data.error);
                }
            } catch (error) {
                setVerificationStatus('error');
                setMessage('An error occurred during verification');
            }
        };
        verifyEmail();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Email Verification
                    </h2>
                   
                    {verificationStatus === 'loading' && (
                        <div className="mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Verifying your email...</p>
                        </div>
                    )}
                    {verificationStatus === 'success' && (
                        <div className="mt-4">
                            <div className="text-green-500 text-xl">✓</div>
                            <p className="mt-2 text-green-600">{message}</p>
                            <Link
                                href="/signin"
                                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                            >
                                Proceed to Login
                            </Link>
                        </div>
                    )}
                    {verificationStatus === 'error' && (
                        <div className="mt-4">
                            <div className="text-red-500 text-xl">✗</div>
                            <p className="mt-2 text-red-600">{message}</p>
                            <Link
                                href="/"
                                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                            >
                                Return to Homepage
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}