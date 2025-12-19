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
    Tooltip,
    Chip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { academicService } from '@/services';
import { useNavigate } from 'react-router-dom';

const classSchema = z.object({
    name: z.string().min(1, "Class name is required"),
    section: z.string().min(1, "Section is required"),
});

export default function Classes() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(classSchema)
    });

    const fetchClasses = async () => {
        try {
            const response = await academicService.getAllClasses();
            if (response.data?.success) {
                // Backend returns { data: { classes: [...] } }
                setClasses(response.data.data?.classes || []);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const onSubmit = async (data) => {
        try {
            const response = await academicService.createClass(data);
            if (response.data?.success) {
                fetchClasses();
                onClose();
                reset();
            }
        } catch (error) {
            console.error('Error creating class:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Classes</h1>
                    <p className="text-sm text-gray-500">Manage school classes and sections</p>
                </div>
                <Button color="primary" startContent={<Icon icon="mdi:plus" />} onPress={onOpen}>
                    Add Class
                </Button>
            </div>

            <Table aria-label="Classes table">
                <TableHeader>
                    <TableColumn>CLASS/GRADE</TableColumn>
                    <TableColumn>SECTION</TableColumn>
                    <TableColumn>STUDENTS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No classes found"} isLoading={isLoading}>
                    {classes.map((cls) => (
                        <TableRow key={cls.id || cls._id}>
                            <TableCell className="font-medium">{cls.name}</TableCell>
                            <TableCell>
                                <Chip size="sm" variant="flat" color="secondary">{cls.section}</Chip>
                            </TableCell>
                            <TableCell>{cls.studentsCount || 0}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Tooltip content="Manage Students">
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            isIconOnly
                                            onPress={() => navigate(`/students?classId=${cls.id}`)}
                                        >
                                            <Icon icon="mdi:account-group" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Edit Class">
                                        <Button isIconOnly size="sm" variant="light">
                                            <Icon icon="mdi:pencil" className="text-lg" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Delete Class">
                                        <Button isIconOnly size="sm" variant="light" color="danger">
                                            <Icon icon="mdi:delete" className="text-lg" />
                                        </Button>
                                    </Tooltip>
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
                            <ModalHeader>Add New Class</ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    <Input
                                        {...register('name')}
                                        label="Class / Grade"
                                        placeholder="e.g. 10, XII"
                                        isInvalid={!!errors.name}
                                        errorMessage={errors.name?.message}
                                    />
                                    <Input
                                        {...register('section')}
                                        label="Section"
                                        placeholder="e.g. A, B"
                                        isInvalid={!!errors.section}
                                        errorMessage={errors.section?.message}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit">
                                    Create Class
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </div >
    );
}
