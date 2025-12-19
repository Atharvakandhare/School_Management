import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Chip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { examService } from '@/services';
import { format } from 'date-fns';

export default function ExamList() {
    const [exams, setExams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await examService.getExams();
            if (response.data?.success) {
                // Backend: { data: { exams: [...] } }
                setExams(response.data.data?.exams || []);
            }
        } catch (error) {
            console.error('Error fetching exams:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exams</h1>
                    <p className="text-sm text-gray-500">Manage school exams and assessments</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/admin/bulk-upload/exams">
                        <Button color="secondary" variant="flat" startContent={<Icon icon="mdi:cloud-upload" />}>
                            Bulk Upload
                        </Button>
                    </Link>
                    <Link to="/exams/new">
                        <Button color="primary" startContent={<Icon icon="mdi:plus" />}>
                            Create Exam
                        </Button>
                    </Link>
                </div>
            </div>

            <Table aria-label="Exams table">
                <TableHeader>
                    <TableColumn>EXAM TITLE</TableColumn>
                    <TableColumn>CLASS</TableColumn>
                    <TableColumn>SUBJECT</TableColumn>
                    <TableColumn>DATE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No exams found"} isLoading={isLoading}>
                    {exams.map((exam) => (
                        <TableRow key={exam._id}>
                            <TableCell className="font-medium">{exam.title}</TableCell>
                            <TableCell>{exam.class?.name}</TableCell>
                            <TableCell>{exam.subject?.name}</TableCell>
                            <TableCell>{format(new Date(exam.date), 'PPP')}</TableCell>
                            <TableCell>
                                <Chip size="sm" variant="flat" color={new Date(exam.date) > new Date() ? "primary" : "success"}>
                                    {new Date(exam.date) > new Date() ? "Upcoming" : "Completed"}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button isIconOnly size="sm" variant="light">
                                        <Icon icon="mdi:pencil" className="text-lg" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
