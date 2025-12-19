import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Select,
    SelectItem,
    Checkbox,
    Card,
    CardBody
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { academicService, attendanceService, studentService } from '@/services';
import { format } from 'date-fns';

export default function MarkAttendance() {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState({});

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await academicService.getAllClasses();
            if (response.data?.success) {
                // Backend: { data: { classes: [...] } }
                setClasses(response.data.data?.classes || []);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleClassChange = async (e) => {
        const classId = e.target.value;
        setSelectedClass(classId);
        if (!classId) return;
        fetchStudents(classId);
    };

    const fetchStudents = async (classId) => {
        setIsLoading(true);
        try {
            const response = await studentService.getAllStudents({ classId });
            if (response.data?.success) {
                setStudents(response.data.data?.students || []);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAttendanceChange = (studentId, isPresent) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: isPresent
        }));
    };

    const handleSubmitAttendance = async () => {
        setIsLoading(true);
        try {
            const payload = {
                classId: selectedClass,
                date: new Date().toISOString(),
                attendance: Object.keys(attendanceData).map(studentId => ({
                    studentId,
                    status: attendanceData[studentId] ? 'PRESENT' : 'ABSENT'
                }))
            };

            const response = await attendanceService.markAttendance(payload);
            if (response.data?.success) {
                // Show success
                alert("Attendance marked successfully");
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mark Attendance</h1>
                    <p className="text-sm text-gray-500">
                        Date: <span className="font-medium text-gray-900 dark:text-white">{format(new Date(), 'PPP')}</span>
                    </p>
                </div>
                <Link to="/admin/bulk-upload/attendance">
                    <Button color="secondary" variant="flat" startContent={<Icon icon="mdi:cloud-upload" />}>
                        Bulk Upload
                    </Button>
                </Link>
            </div>

            <div className="mb-6 max-w-xs">
                <Select
                    label="Select Class"
                    placeholder="Choose a class"
                    onChange={handleClassChange}
                >
                    {classes.map((cls) => (
                        <SelectItem key={cls._id} value={cls._id}>
                            {cls.name}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            {selectedClass && (
                <Card>
                    <CardBody>
                        <Table aria-label="Students attendance table" shadow="none">
                            <TableHeader>
                                <TableColumn>STUDENT NAME</TableColumn>
                                <TableColumn>STATUS</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student._id}>
                                        <TableCell>{student.firstName} {student.lastName}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                isSelected={!!attendanceData[student._id]}
                                                onValueChange={(isSelected) => handleAttendanceChange(student._id, isSelected)}
                                            >
                                                Present
                                            </Checkbox>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6 flex justify-end">
                            <Button
                                color="primary"
                                onPress={handleSubmitAttendance}
                                isLoading={isLoading}
                                startContent={!isLoading && <Icon icon="mdi:check" />}
                            >
                                Submit Attendance
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
