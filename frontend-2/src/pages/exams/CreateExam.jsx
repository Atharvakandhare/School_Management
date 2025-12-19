import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Input,
    Select,
    SelectItem,
    Card,
    CardBody,
    DatePicker
} from "@heroui/react"; // Check if DatePicker exists in HeroUI/NextUI v2 or use native input
import { Icon } from "@iconify/react";
import { academicService, examService } from '@/services';

const examSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    classId: z.string().min(1, "Class is required"),
    subjectId: z.string().min(1, "Subject is required"),
    date: z.string().min(1, "Date is required"),
    totalMarks: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(1, "Total marks is required")),
});

export default function CreateExam() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(examSchema)
    });

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const [classRes, subjectRes] = await Promise.all([
                academicService.getAllClasses(),
                academicService.getAllSubjects()
            ]);

            if (classRes.data?.success) setClasses(classRes.data.data);
            if (subjectRes.data?.success) setSubjects(subjectRes.data.data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await examService.createExam(data);
            if (response.data?.success) {
                navigate('/exams');
            }
        } catch (error) {
            console.error('Error creating exam:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Button isIconOnly variant="light" onPress={() => navigate(-1)}>
                    <Icon icon="mdi:arrow-left" className="text-xl" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Exam</h1>
                    <p className="text-sm text-gray-500">Schedule a new exam</p>
                </div>
            </div>

            <Card>
                <CardBody className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            {...register('title')}
                            label="Exam Title"
                            placeholder="e.g. Midterm Mathematics"
                            isInvalid={!!errors.title}
                            errorMessage={errors.title?.message}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Select Class"
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

                            <Select
                                label="Select Subject"
                                {...register('subjectId')}
                                isInvalid={!!errors.subjectId}
                                errorMessage={errors.subjectId?.message}
                            >
                                {subjects.map((sub) => (
                                    <SelectItem key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                {...register('date')}
                                type="date"
                                label="Exam Date"
                                isInvalid={!!errors.date}
                                errorMessage={errors.date?.message}
                            />
                            <Input
                                {...register('totalMarks')}
                                type="number"
                                label="Total Marks"
                                isInvalid={!!errors.totalMarks}
                                errorMessage={errors.totalMarks?.message}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button color="danger" variant="light" onPress={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button color="primary" type="submit" isLoading={isLoading}>
                                Create Exam
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
