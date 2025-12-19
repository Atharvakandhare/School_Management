import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { dashboardService } from '@/services';

export default function SchoolAdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        counts: {
            classes: 0,
            parents: 0,
            students: 0,
            teachers: 0,
        },
        recentStudents: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await dashboardService.getSchoolStats();
                if (response.data?.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Students', value: stats.counts.students, icon: 'mdi:account-school', color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { title: 'Total Teachers', value: stats.counts.teachers, icon: 'mdi:account-tie', color: 'text-fuchsia-600', bg: 'bg-fuchsia-100' },
        { title: 'Total Classes', value: stats.counts.classes, icon: 'mdi:google-classroom', color: 'text-teal-600', bg: 'bg-teal-100' },
        { title: 'Parents', value: stats.counts.parents, icon: 'mdi:human-male-female-child', color: 'text-rose-600', bg: 'bg-rose-100' },
    ];

    if (loading) {
        return <div className="flex justify-center items-center h-full p-10"><Spinner size="lg" /></div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-brand-6 dark:text-brand-4">School Dashboard</h1>
                <p className="text-brand-7">Overview of your academic institution</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} className="shadow-sm border-none">
                        <CardBody className="flex flex-row items-center gap-4 p-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <Icon icon={stat.icon} className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-brand-7">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-brand-6 dark:text-brand-4">{stat.value}</h3>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Students - Takes up 2 columns */}
                <Card className="lg:col-span-2 shadow-sm min-h-[300px]">
                    <CardHeader className="font-bold text-lg px-6 pt-6 flex justify-between items-center">
                        <span>New Admissions</span>
                        <Chip size="sm" variant="flat" className="bg-brand-1/10 text-brand-1">Last 5</Chip>
                    </CardHeader>
                    <CardBody className="px-4 pb-4">
                        <Table aria-label="Recent Students">
                            <TableHeader>
                                <TableColumn>STUDENT</TableColumn>
                                <TableColumn>ADMISSION NO</TableColumn>
                                <TableColumn>CLASS</TableColumn>
                                <TableColumn>JOINED</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="No recent admissions">
                                {stats.recentStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <User
                                                name={student.name}
                                                avatarProps={{ src: `https://i.pravatar.cc/150?u=${student.id}`, size: "sm" }}
                                            />
                                        </TableCell>
                                        <TableCell>{student.admissionNumber}</TableCell>
                                        <TableCell>
                                            {student.Class ? `${student.Class.name}-${student.Class.section}` : '-'}
                                        </TableCell>
                                        <TableCell className="text-default-400 text-sm">
                                            {new Date(student.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>

                {/* Quick Actions / Notices */}
                <Card className="shadow-sm min-h-[300px]">
                    <CardHeader className="font-bold text-lg px-6 pt-6">Quick Actions</CardHeader>
                    <CardBody className="px-6 pb-6 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-brand-2 cursor-pointer hover:bg-brand-3 transition-colors" onClick={() => window.location.href = '/students'}>
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <Icon icon="mdi:account-plus" className="text-xl" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Add Student</p>
                                <p className="text-tiny text-default-500">Register new admission</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-brand-2 cursor-pointer hover:bg-brand-3 transition-colors" onClick={() => window.location.href = '/attendance/mark'}>
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                <Icon icon="mdi:calendar-check" className="text-xl" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Mark Attendance</p>
                                <p className="text-tiny text-default-500">Record daily entries</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-brand-2 cursor-pointer hover:bg-brand-3 transition-colors" onClick={() => window.location.href = '/academic/classes'}>
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <Icon icon="mdi:google-classroom" className="text-xl" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Manage Classes</p>
                                <p className="text-tiny text-default-500">View & edit structures</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
