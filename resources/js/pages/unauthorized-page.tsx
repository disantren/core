import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';


const UnauthorizedPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-96 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-red-500">
                        Unauthorized
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-600">
                        You do not have permission to access this resource.
                    </p>
                    <div className="flex justify-center mt-4">
                        <Link href="/">
                            <Button className="bg-red-500 hover:bg-red-600 text-white">
                                Go Back
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UnauthorizedPage;