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
    Chip,
    Select,
    SelectItem
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { financeService, academicService } from '@/services';

const feeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    amount: z.string().transform(val => parseFloat(val)).pipe(z.number().min(0, "Amount must be positive")),
    classId: z.string().min(1, "Class is required"),
    frequency: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'ONE_TIME']),
    dueDate: z.string().min(1, "Due date is required"),
});

export default function FeeStructure() {
    const [fees, setFees] = useState([]);
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(feeSchema)
    });

    const fetchData = async () => {
        try {
            const [feeRes, classRes] = await Promise.all([
                financeService.getFeeStructures(),
                academicService.getAllClasses()
            ]);

            // Backend returns nested data: { data: { fees: [...] } } and { data: { classes: [...] } }
            if (feeRes.data?.success) setFees(feeRes.data.data?.fees || []);
            if (classRes.data?.success) setClasses(classRes.data.data?.classes || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        try {
            const response = await financeService.createFeeStructure(data);
            if (response.data?.success) {
                fetchData();
                onClose();
                reset();
            }
        } catch (error) {
            console.error('Error creating fee structure:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Structures</h1>
                    <p className="text-sm text-gray-500">Manage school fees</p>
                </div>
                <Button color="primary" startContent={<Icon icon="mdi:plus" />} onPress={onOpen}>
                    Add Fee
                </Button>
            </div>

            <Table aria-label="Fee structures table">
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>CLASS</TableColumn>
                    <TableColumn>AMOUNT</TableColumn>
                    <TableColumn>FREQUENCY</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No fee structures found"} isLoading={isLoading}>
                    {fees.map((fee) => (
                        <TableRow key={fee._id}>
                            <TableCell className="font-medium">{fee.name}</TableCell>
                            <TableCell>
                                {classes.find(c => c._id === fee.classId)?.name || 'All Classes'}
                            </TableCell>
                            <TableCell>${fee.amount}</TableCell>
                            <TableCell>
                                <Chip size="sm" variant="flat" color="warning">{fee.frequency}</Chip>
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

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader>Add New Fee</ModalHeader>
                            <ModalBody>
                                <Input
                                    {...register('name')}
                                    label="Fee Name"
                                    placeholder="e.g. Tuition Fee"
                                    isInvalid={!!errors.name}
                                    errorMessage={errors.name?.message}
                                />

                                <Select
                                    label="Class"
                                    {...register('classId')}
                                    isInvalid={!!errors.classId}
                                    errorMessage={errors.classId?.message}
                                >
                                    {classes.map((cls) => (
                                        <SelectItem key={cls._id} value={cls._id}>
                                            {cls.name}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        {...register('amount')}
                                        type="number"
                                        label="Amount"
                                        startContent="$"
                                        isInvalid={!!errors.amount}
                                        errorMessage={errors.amount?.message}
                                    />
                                    <Select
                                        label="Frequency"
                                        {...register('frequency')}
                                        isInvalid={!!errors.frequency}
                                        errorMessage={errors.frequency?.message}
                                    >
                                        {['MONTHLY', 'QUARTERLY', 'YEARLY', 'ONE_TIME'].map((f) => (
                                            <SelectItem key={f} value={f}>{f}</SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                <Input
                                    {...register('dueDate')}
                                    type="date"
                                    label="Due Date"
                                    isInvalid={!!errors.dueDate}
                                    errorMessage={errors.dueDate?.message}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit">
                                    Create Fee
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
