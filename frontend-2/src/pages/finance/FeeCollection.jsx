import React from 'react';
import { Button, Input, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function FeeCollection() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Collect Fees</h1>

            <div className="flex gap-4 mb-8">
                <Input
                    placeholder="Search Student by ID or Name"
                    className="max-w-md"
                    startContent={<Icon icon="mdi:magnify" />}
                />
                <Button color="primary">Search</Button>
            </div>

            <Card className="min-h-[300px] flex items-center justify-center border-dashed border-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <CardBody className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon icon="mdi:cash-register" className="text-3xl text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Fee Payment</h3>
                    <p className="text-gray-500 mt-2">Search for a student to view pending fees and accept payments.</p>
                </CardBody>
            </Card>
        </div>
    );
}
