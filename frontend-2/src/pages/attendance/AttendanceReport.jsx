import React from 'react';
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function AttendanceReport() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Attendance Reports</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardBody className="flex flex-row items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Icon icon="mdi:calendar-check" className="text-2xl text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Average Attendance</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">92%</p>
                        </div>
                    </CardBody>
                </Card>
                {/* Placeholder for real charts/reports */}
            </div>

            <div className="mt-8 flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <Icon icon="mdi:chart-bar" className="text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detailed Reports Coming Soon</h3>
                <p className="text-gray-500 text-center max-w-md mt-2">
                    We are building comprehensive reporting tools to help you track attendance trends across classes and subjects.
                </p>
            </div>
        </div>
    );
}
