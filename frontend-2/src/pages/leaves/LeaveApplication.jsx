import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Card, CardBody, CardHeader,
    Input, Textarea, Select, SelectItem, Button,
    Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Chip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { leaveService } from '@/services';
import { format } from 'date-fns';

const leaveSchema = z.object({
    type: z.enum(["SICK", "CASUAL", "PRIVILEGE", "METERNITY", "OTHER"], {
        errorMap: () => ({ message: "Please select a leave type" })
    }),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().min(5, "Reason must be at least 5 characters"),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"]
});

export default function LeaveApplication() {
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch user's leave history
    const fetchLeaves = async () => {
        const response = await leaveService.getMyLeaves();
        if (response.data?.success) {
            setLeaves(response.data.data?.leaves || []);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(leaveSchema)
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await leaveService.applyLeave(data);
            if (response.data?.success) {
                alert("Leave application submitted successfully!");
                reset();
                fetchLeaves(); // Refresh list
            } else {
                alert(response.data?.message || "Failed to submit request");
            }
        } catch (error) {
            console.error("Submit leave error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return "success";
            case 'REJECTED': return "danger";
            default: return "warning";
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Application Form */}
            <div>
                <Card>
                    <CardHeader className="font-bold text-lg">Apply for Leave</CardHeader>
                    <CardBody>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Select
                                label="Leave Type"
                                placeholder="Select type"
                                {...register("type")}
                                errorMessage={errors.type?.message}
                                isInvalid={!!errors.type}
                            >
                                <SelectItem key="CASUAL" value="CASUAL">Casual Leave</SelectItem>
                                <SelectItem key="SICK" value="SICK">Sick Leave</SelectItem>
                                <SelectItem key="PRIVILEGE" value="PRIVILEGE">Privilege Leave</SelectItem>
                                <SelectItem key="METERNITY" value="METERNITY">Maternity Leave</SelectItem>
                                <SelectItem key="OTHER" value="OTHER">Other</SelectItem>
                            </Select>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="date"
                                    label="Start Date"
                                    {...register("startDate")}
                                    errorMessage={errors.startDate?.message}
                                    isInvalid={!!errors.startDate}
                                />
                                <Input
                                    type="date"
                                    label="End Date"
                                    {...register("endDate")}
                                    errorMessage={errors.endDate?.message}
                                    isInvalid={!!errors.endDate}
                                />
                            </div>

                            <Textarea
                                label="Reason"
                                placeholder="Why do you need leave?"
                                {...register("reason")}
                                errorMessage={errors.reason?.message}
                                isInvalid={!!errors.reason}
                            />

                            <Button
                                type="submit"
                                color="primary"
                                isLoading={isLoading}
                                className="w-full"
                            >
                                {isLoading ? "Submitting..." : "Submit Application"}
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>

            {/* Leave History */}
            <div>
                <Card className="h-full">
                    <CardHeader className="font-bold text-lg">My Leave History</CardHeader>
                    <CardBody>
                        {leaves.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">No leave history found.</div>
                        ) : (
                            <Table aria-label="Leave history">
                                <TableHeader>
                                    <TableColumn>TYPE</TableColumn>
                                    <TableColumn>DATES</TableColumn>
                                    <TableColumn>STATUS</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {leaves.map((leave) => (
                                        <TableRow key={leave.id}>
                                            <TableCell>{leave.type}</TableCell>
                                            <TableCell>
                                                <div className="text-xs">
                                                    {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Chip color={getStatusColor(leave.status)} size="sm" variant="flat">
                                                    {leave.status}
                                                </Chip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
