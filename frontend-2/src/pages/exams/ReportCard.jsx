import React, { useState } from 'react';
import { Button, Input, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { examService } from '@/services';

export default function ReportCard() {
    const [studentId, setStudentId] = useState('');
    const [report, setReport] = useState(null);

    const handleSearch = async () => {
        // pending backend implementation
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Student Report Cards</h1>

            <div className="flex gap-4 mb-8">
                <Input
                    placeholder="Enter Student ID"
                    value={studentId}
                    onValueChange={setStudentId}
                    className="max-w-xs"
                    startContent={<Icon icon="mdi:account-search" />}
                />
                <Button color="primary" onPress={handleSearch}>Generate Report</Button>
            </div>

            <Card className="min-h-[300px] flex items-center justify-center">
                <CardBody className="text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon icon="mdi:card-account-details-outline" className="text-3xl text-blue-500" />
                    </div>
                    <p className="text-gray-500">Enter a student ID to generate their academic report card.</p>
                </CardBody>
            </Card>
        </div>
    );
}
