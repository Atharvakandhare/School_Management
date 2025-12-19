import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { academicService } from '@/services';

export default function Timetable() {
    const [timetable, setTimetable] = useState([]);

    // Placeholder for fetch logic
    useEffect(() => {
        // fetchTimetable();
    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable</h1>
                    <p className="text-sm text-gray-500">Manage class schedules</p>
                </div>
                <Button color="primary" startContent={<Icon icon="mdi:plus" />}>
                    Create Entry
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardBody className="py-12 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Icon icon="mdi:calendar-clock" className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Timetable Found</h3>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            Create a timetable structure to start managing class schedules and teacher assignments.
                        </p>
                        <Button color="primary" variant="flat">
                            Generate Timetable
                        </Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
