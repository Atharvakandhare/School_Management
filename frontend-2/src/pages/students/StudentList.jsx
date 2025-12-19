import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Select,
    SelectItem,
    Chip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { studentService, academicService } from '@/services';
import { PageHeader } from '@/components/common';

const studentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    admissionNumber: z.string().min(1, "Admission Number is required"),
    dob: z.string().min(1, "Date of Birth is required"),
    gender: z.enum(["Male", "Female", "Other"]),
    classId: z.string().optional(),
});

export default function StudentList() {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [searchParams] = useSearchParams();

    // Add/Edit Student Modal
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Bulk/Single Update Class Modal
    const {
        isOpen: isUpdateOpen,
        onOpen: onUpdateOpen,
        onOpenChange: onUpdateOpenChange
    } = useDisclosure();

    // State for updates
    const [targetClassId, setTargetClassId] = useState("");
    const [studentToUpdate, setStudentToUpdate] = useState(null); // If null, it's bulk update

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(studentSchema)
    });

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, [searchParams]); // Re-fetch if params change

    // Sync URL classId to form
    useEffect(() => {
        const classIdParam = searchParams.get('classId');
        if (classIdParam) {
            setValue('classId', classIdParam);
        }
    }, [searchParams, setValue]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const classId = searchParams.get("classId");
            const response = await studentService.getAllStudents();
            if (response.data?.success) {
                let data = response.data.data.students;
                if (classId) {
                    data = data.filter(s => s.classId === classId);
                }
                setStudents(data);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await academicService.getAllClasses();
            if (response.data?.success) {
                setClasses(response.data.data?.classes || []);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    const onSubmit = async (data) => {
        try {
            const response = await studentService.createStudent(data);
            if (response.data?.success) {
                fetchStudents();
                onOpenChange(false);
                reset();
            }
        } catch (error) {
            console.error("Error creating student:", error);
        }
    };

    // Bulk Update Handler
    const handleBulkUpdate = async () => {
        if (!targetClassId) return;

        let idsToUpdate = [];
        if (studentToUpdate) {
            idsToUpdate = [studentToUpdate];
        } else {
            // "all" selection handling
            if (selectedKeys === "all") {
                idsToUpdate = students.map(s => s.id);
            } else {
                idsToUpdate = Array.from(selectedKeys);
            }
        }

        try {
            const response = await studentService.bulkUpdateStudents({
                studentIds: idsToUpdate,
                classId: targetClassId
            });

            if (response.data?.success) {
                fetchStudents();
                setSelectedKeys(new Set([]));
                setStudentToUpdate(null);
                setTargetClassId("");
                onUpdateOpenChange(false);
            }
        } catch (error) {
            console.error("Error updating students:", error);
        }
    };

    const openSingleUpdateModal = (studentId) => {
        setStudentToUpdate(studentId);
        // Pre-select current class if possible
        const student = students.find(s => s.id === studentId);
        if (student && student.classId) setTargetClassId(student.classId);
        else setTargetClassId("");

        onUpdateOpen();
    };

    return (
        <div className="space-y-6 p-6">
            <PageHeader
                title="Students"
                description="Manage student records"
                action={
                    <div className="flex gap-2">
                        {(selectedKeys === "all" || selectedKeys.size > 0) && (
                            <Button
                                color="warning"
                                variant="flat"
                                startContent={<Icon icon="mdi:arrow-up-bold-box-outline" />}
                                onPress={() => { setStudentToUpdate(null); setTargetClassId(""); onUpdateOpen(); }}
                            >
                                Move / Promote ({selectedKeys === "all" ? students.length : selectedKeys.size})
                            </Button>
                        )}
                        <Button
                            color="secondary"
                            variant="flat"
                            startContent={<Icon icon="mdi:cloud-upload" />}
                            onPress={() => window.location.href = '/admin/bulk-upload/students'}
                        >
                            Bulk Upload
                        </Button>
                        <Button color="primary" startContent={<Icon icon="mdi:plus" />} onPress={onOpen}>
                            Add Student
                        </Button>
                    </div>
                }
            />

            <Table
                aria-label="Students Table"
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
            >
                <TableHeader>
                    <TableColumn>ADMISSION NO</TableColumn>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>GENDER</TableColumn>
                    <TableColumn>CLASS</TableColumn>
                    <TableColumn>PARENT</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No students found"} isLoading={loading}>
                    {students.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell>{student.admissionNumber}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-bold text-small">{student.name}</span>
                                    <span className="text-tiny text-default-400">{student.dob}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip size="sm" variant="flat" color={student.gender === 'Male' ? 'primary' : 'secondary'}>
                                    {student.gender}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <span className="capitalize">{student.Class?.name}-{student.Class?.section}</span>
                            </TableCell>
                            <TableCell>
                                {student.Parent ? (
                                    <div className="flex flex-col">
                                        <span className="text-small">{student.Parent.guardianName}</span>
                                        <span className="text-tiny text-default-400">{student.Parent.occupation}</span>
                                    </div>
                                ) : (
                                    <span className="text-default-400 italic">Not Linked</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onPress={() => openSingleUpdateModal(student.id)}
                                        title="Change Class"
                                    >
                                        <Icon icon="mdi:school-outline" className="text-lg" />
                                    </Button>
                                    <Button isIconOnly size="sm" variant="light" color="danger">
                                        <Icon icon="mdi:delete" className="text-lg" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Create Student Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader>Add New Student</ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Name"
                                        placeholder="John Doe"
                                        variant="bordered"
                                        {...register("name")}
                                        isInvalid={!!errors.name}
                                        errorMessage={errors.name?.message}
                                    />
                                    <Input
                                        label="Admission Number"
                                        placeholder="ADM-001"
                                        variant="bordered"
                                        {...register("admissionNumber")}
                                        isInvalid={!!errors.admissionNumber}
                                        errorMessage={errors.admissionNumber?.message}
                                    />
                                    <Input
                                        type="date"
                                        label="Date of Birth"
                                        variant="bordered"
                                        placeholder=" "
                                        {...register("dob")}
                                        isInvalid={!!errors.dob}
                                        errorMessage={errors.dob?.message}
                                    />
                                    <Select
                                        label="Gender"
                                        variant="bordered"
                                        {...register("gender")}
                                        isInvalid={!!errors.gender}
                                        errorMessage={errors.gender?.message}
                                    >
                                        <SelectItem key="Male" value="Male">Male</SelectItem>
                                        <SelectItem key="Female" value="Female">Female</SelectItem>
                                        <SelectItem key="Other" value="Other">Other</SelectItem>
                                    </Select>
                                    <Select
                                        items={classes}
                                        label="Class"
                                        variant="bordered"
                                        placeholder="Select Class"
                                        {...register("classId")}
                                        isInvalid={!!errors.classId}
                                        errorMessage={errors.classId?.message}
                                    >
                                        {(cls) => <SelectItem key={cls.id} value={cls.id}>{`${cls.name}-${cls.section}`}</SelectItem>}
                                    </Select>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit">
                                    Create Student
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>

            {/* Update Class Modal */}
            <Modal isOpen={isUpdateOpen} onOpenChange={onUpdateOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                {studentToUpdate ? "Update Student Class" : "Move / Promote Students"}
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-sm text-gray-500 mb-4">
                                    {studentToUpdate
                                        ? "Select the new class for this student."
                                        : `Select the target class for ${selectedKeys === "all" ? students.length : selectedKeys.size} selected students.`
                                    }
                                </p>
                                <Select
                                    items={classes}
                                    label="Target Class"
                                    placeholder="Select a class"
                                    selectedKeys={targetClassId ? [targetClassId] : []}
                                    onChange={(e) => setTargetClassId(e.target.value)}
                                >
                                    {(cls) => <SelectItem key={cls.id} value={cls.id}>{`${cls.name}-${cls.section}`}</SelectItem>}
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={handleBulkUpdate} isDisabled={!targetClassId}>
                                    {studentToUpdate ? "Update" : "Move Students"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
