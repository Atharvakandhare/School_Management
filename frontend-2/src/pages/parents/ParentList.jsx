import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Chip,
    User,
    Tooltip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { parentService } from '@/services';
import { PageHeader } from '@/components/common';
import { Link, useNavigate } from 'react-router-dom';

export default function ParentList() {
    const navigate = useNavigate();
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchParents();
    }, []);

    const fetchParents = async () => {
        try {
            const response = await parentService.getAllParents();
            if (response.data?.success) {
                setParents(response.data.data.parents);
            }
        } catch (error) {
            console.error("Error fetching parents:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <PageHeader
                title="Parents"
                description="Manage parent accounts and their linked students"
                action={
                    <div className="flex gap-2">
                        <Button
                            color="secondary"
                            variant="flat"
                            startContent={<Icon icon="mdi:cloud-upload" />}
                            onPress={() => navigate('/admin/bulk-upload/students')} // Bulk upload handles parents too
                        >
                            Bulk Upload
                        </Button>
                        <Button
                            color="primary"
                            startContent={<Icon icon="mdi:plus" />}
                            onPress={() => navigate('/register-parent')}
                        >
                            Add Parent
                        </Button>
                    </div>
                }
            />

            <Table aria-label="Parents Table">
                <TableHeader>
                    <TableColumn>GUARDIAN</TableColumn>
                    <TableColumn>CONTACT</TableColumn>
                    <TableColumn>CHILDREN</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No parents found"} isLoading={loading}>
                    {parents.map((parent) => (
                        <TableRow key={parent.id}>
                            <TableCell>
                                <User
                                    name={parent.guardianName}
                                    description={parent.occupation}
                                    avatarProps={{
                                        src: `https://i.pravatar.cc/150?u=${parent.id}`
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-small">{parent.User?.email}</span>
                                    <span className="text-tiny text-default-400">{parent.User?.phone || "N/A"}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {parent.Students && parent.Students.length > 0 ? (
                                    <div className="flex gap-1 flex-wrap">
                                        {parent.Students.map(student => (
                                            <Chip key={student.id} size="sm" variant="flat">
                                                {student.name}
                                            </Chip>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-default-400 italic">No students linked</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Chip color="success" size="sm" variant="dot">Active</Chip>
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center gap-2">
                                    <Tooltip content="Link Student">
                                        <span
                                            className="text-lg text-primary cursor-pointer active:opacity-50"
                                            onClick={() => navigate(`/parents/${parent.id}/link-students`, { state: { parent } })}
                                        >
                                            <Icon icon="mdi:account-plus" />
                                        </span>
                                    </Tooltip>
                                    <Tooltip content="Edit Parent">
                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                            <Icon icon="mdi:pencil" />
                                        </span>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
