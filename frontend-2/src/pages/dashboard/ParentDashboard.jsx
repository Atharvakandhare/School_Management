import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Avatar, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { parentService } from '@/services';
import { PageHeader } from '@/components/common';
import { useNavigate } from 'react-router-dom';

export default function ParentDashboard() {
    const navigate = useNavigate();
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            const response = await parentService.getMyChildren();
            if (response.data?.success) {
                setChildren(response.data.data.students);
            }
        } catch (error) {
            console.error("Error fetching children:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <PageHeader
                title="My Children"
                description="Select a child to view their academic progress"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children.map((child) => (
                    <Card
                        key={child.id}
                        isPressable
                        onPress={() => navigate(`/parent/child/${child.id}`)}
                        className="hover:scale-105 transition-transform"
                    >
                        <CardHeader className="justify-between">
                            <div className="flex gap-3">
                                <Avatar isBordered radius="full" size="md" src={`https://i.pravatar.cc/150?u=${child.id}`} />
                                <div className="flex flex-col gap-1 items-start justify-center">
                                    <h4 className="text-small font-semibold leading-none text-default-600">{child.name}</h4>
                                    <h5 className="text-small tracking-tight text-default-400">{child.admissionNumber}</h5>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="px-3 py-0 text-small text-default-400">
                            <div className="flex justify-between items-center mb-2">
                                <span>Class:</span>
                                <span className="text-default-600 font-medium">
                                    {child.Class ? `${child.Class.name} - ${child.Class.section}` : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span>School:</span>
                                <span className="text-default-600">{child.Class?.School?.name || "Hirelyft School"}</span>
                            </div>
                        </CardBody>
                    </Card>
                ))}

                {children.length === 0 && !loading && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-500">
                        <Icon icon="mdi:account-school" className="text-6xl mb-4" />
                        <p>No children linked to your account.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
