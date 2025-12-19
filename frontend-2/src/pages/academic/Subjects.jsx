import React, { useState, useEffect } from 'react';
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
    Chip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { academicService } from '@/services';

const subjectSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    code: z.string().min(1, "Subject code is required"),
});

export default function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(subjectSchema)
    });

    const fetchSubjects = async () => {
        try {
            const response = await academicService.getAllSubjects();
            if (response.data?.success) {
                // Backend returns { data: { subjects: [...] } }
                setSubjects(response.data.data?.subjects || []);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const onSubmit = async (data) => {
        try {
            const response = await academicService.createSubject(data);
            if (response.data?.success) {
                fetchSubjects();
                onClose();
                reset();
            }
        } catch (error) {
            console.error('Error creating subject:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subjects</h1>
                    <p className="text-sm text-gray-500">Manage academic subjects</p>
                </div>
                <Button color="primary" startContent={<Icon icon="mdi:plus" />} onPress={onOpen}>
                    Add Subject
                </Button>
            </div>

            <Table aria-label="Subjects table">
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>CODE</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No subjects found"} isLoading={isLoading}>
                    {subjects.map((subject) => (
                        <TableRow key={subject._id}>
                            <TableCell className="font-medium">{subject.name}</TableCell>
                            <TableCell>
                                <Chip size="sm" variant="dot" color="primary">{subject.code}</Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button isIconOnly size="sm" variant="light">
                                        <Icon icon="mdi:pencil" className="text-lg" />
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

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader>Add New Subject</ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    <Input
                                        {...register('name')}
                                        label="Subject Name"
                                        placeholder="e.g. Mathematics"
                                        isInvalid={!!errors.name}
                                        errorMessage={errors.name?.message}
                                    />
                                    <Input
                                        {...register('code')}
                                        label="Subject Code"
                                        placeholder="e.g. MATH101"
                                        isInvalid={!!errors.code}
                                        errorMessage={errors.code?.message}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit">
                                    Create Subject
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
