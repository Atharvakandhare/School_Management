import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

const TeacherDashboard = () => {
    const { user } = useAuth();

    const quickActions = [
        {
            title: "Mark Attendance",
            icon: "mdi:calendar-check",
            link: "/attendance/mark",
            color: "primary"
        },
        {
            title: "My Timetable",
            icon: "mdi:timetable",
            link: "/academic/timetable", // We might reuse the generic one or a specific View
            color: "secondary"
        },
        {
            title: "Apply Leave",
            icon: "mdi:file-document-edit",
            link: "/leaves/apply", // New page needed
            color: "warning"
        },
        {
            title: "My Profile",
            icon: "mdi:account-circle",
            link: "/profile",
            color: "default"
        }
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Teacher Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Welcome back, {user?.name}
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        {user?.role}
                    </span>
                    {user?.StaffProfile && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {user.StaffProfile.employeeCode}
                        </span>
                    )}
                </div>
            </div>

            {/* Quick Stats (Mock for now, can be real later) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
                    <CardBody className="flex flex-row items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Icon icon="mdi:school" className="text-3xl" />
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm">Assigned Classes</p>
                            <h3 className="text-2xl font-bold">5</h3>
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
                    <CardBody className="flex flex-row items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Icon icon="mdi:account-group" className="text-3xl" />
                        </div>
                        <div>
                            <p className="text-purple-100 text-sm">Total Students</p>
                            <h3 className="text-2xl font-bold">120</h3>
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none">
                    <CardBody className="flex flex-row items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Icon icon="mdi:calendar-clock" className="text-3xl" />
                        </div>
                        <div>
                            <p className="text-orange-100 text-sm">Pending Leaves</p>
                            <h3 className="text-2xl font-bold">0</h3>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link key={index} to={action.link}>
                            <Card isHoverable isPressable className="h-full">
                                <CardBody className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                                    <div className={`p-3 rounded-full bg-${action.color}-50 text-${action.color}-500`}>
                                        <Icon icon={action.icon} className="text-2xl" />
                                    </div>
                                    <span className="font-medium text-gray-700 dark:text-gray-200">
                                        {action.title}
                                    </span>
                                </CardBody>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Timetable Preview (Placeholder) */}
            <Card className="w-full">
                <CardHeader>
                    <h3 className="text-lg font-semibold">Today's Schedule</h3>
                </CardHeader>
                <CardBody>
                    <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-dashed border-2">
                        <Icon icon="mdi:calendar-blank" className="text-4xl mx-auto mb-2 text-gray-400" />
                        <p>No classes scheduled for today (Mock)</p>
                        <Button size="sm" color="primary" variant="flat" className="mt-4" as={Link} to="/academic/timetable">
                            View Full Timetable
                        </Button>
                    </div>
                </CardBody>
            </Card>

        </div>
    );
};

export default TeacherDashboard;
