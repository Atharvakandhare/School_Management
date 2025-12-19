import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { dashboardService } from '@/services';

export default function SystemAdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        counts: {
            schools: 0,
            users: 0,
            revenue: 0,
        },
        recentSchools: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await dashboardService.getSystemStats();
                if (response.data?.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching system stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Registered Schools', value: stats.counts.schools, icon: 'mdi:domain', color: 'text-violet-600', bg: 'bg-violet-100' },
        { title: 'Total Revenue', value: `$${stats.counts.revenue}`, icon: 'mdi:currency-usd', color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { title: 'Total Users', value: stats.counts.users, icon: 'mdi:account-group', color: 'text-amber-600', bg: 'bg-amber-100' },
        { title: 'System Health', value: '99.9%', icon: 'mdi:heart-pulse', color: 'text-cyan-600', bg: 'bg-cyan-100' },
    ];

    if (loading) {
        return <div className="flex justify-center items-center h-full p-10"><Spinner size="lg" /></div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Overview</h1>
                <p className="text-gray-500">Welcome to the Super Admin Control Panel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} className="shadow-sm border-none">
                        <CardBody className="flex flex-row items-center gap-4 p-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <Icon icon={stat.icon} className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm min-h-[300px]">
                    <CardHeader className="font-bold text-lg px-6 pt-6 flex justify-between">
                        <span>Recent Registrations</span>
                        <Chip size="sm" variant="flat" color="secondary">Schools</Chip>
                    </CardHeader>
                    <CardBody className="px-4 pb-4">
                        <Table aria-label="Recent Schools" removeWrapper>
                            <TableHeader>
                                <TableColumn>SCHOOL NAME</TableColumn>
                                <TableColumn>EMAIL</TableColumn>
                                <TableColumn>DATE</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="No recent registrations">
                                {stats.recentSchools.map((school) => (
                                    <TableRow key={school.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs">
                                                    {school.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-small">{school.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-tiny text-default-500">{school.email}</TableCell>
                                        <TableCell className="text-tiny">{new Date(school.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Chip size="sm" color="success" variant="flat">Active</Chip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="font-bold text-lg px-6 pt-6">System Health</CardHeader>
                    <CardBody className="px-6 pb-6 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <Icon icon="mdi:server-network" className="text-5xl mx-auto mb-4 opacity-50 text-cyan-500" />
                            <p className="text-lg font-semibold text-gray-700 dark:text-white">All systems operational</p>
                            <p className="text-sm">Server Uptime: 99.9%</p>
                            <div className="flex gap-4 mt-6 justify-center">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">CPU Load</p>
                                    <p className="font-bold text-emerald-500">12%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Memory</p>
                                    <p className="font-bold text-blue-500">45%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Storage</p>
                                    <p className="font-bold text-amber-500">28%</p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
