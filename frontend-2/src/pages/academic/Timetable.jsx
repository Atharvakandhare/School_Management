import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { academicService } from '@/services';

export default function Timetable() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        setLoading(true);
        try {
            // For now fetching all, backend filters if we pass params or based on role
            // Ideally backend filters by user role automatically if no params
            const response = await academicService.getTimetable();
            if (response.data?.success) {
                setTimetable(response.data.data?.timetable || []);
            }
        } catch (error) {
            console.error("Error fetching timetable:", error);
        } finally {
            setLoading(false);
        }
    };

    // Group by Day
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const groupedTimetable = days.reduce((acc, day) => {
        acc[day] = timetable.filter(t => t.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
        return acc;
    }, {});

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable</h1>
                    <p className="text-sm text-gray-500">My Weekly Schedule</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : timetable.length === 0 ? (
                <Card>
                    <CardBody className="py-12 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Icon icon="mdi:calendar-clock" className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Timetable Found</h3>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            You don't have any classes scheduled yet.
                        </p>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {days.map(day => (
                        <Card key={day} className="h-full">
                            <CardBody>
                                <h3 className="text-lg font-bold mb-4 text-primary">{day}</h3>
                                {groupedTimetable[day]?.length > 0 ? (
                                    <div className="space-y-3">
                                        {groupedTimetable[day].map((entry) => (
                                            <div key={entry.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-indigo-500">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {entry.Subject?.name || "Subject"}
                                                    </span>
                                                    <span className="text-xs font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {entry.startTime.slice(0, 5)} - {entry.endTime.slice(0, 5)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Class: <span className="font-medium">{entry.Class?.name} {entry.Class?.section}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No classes</p>
                                )}
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
