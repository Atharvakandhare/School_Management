import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { examService } from '@/services';

export default function ExamResults() {
    const [results, setResults] = useState([]);

    // Placeholder pending backend implementation for getting results list
    // useEffect(() => { fetchResults(); }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Results</h1>
                    <p className="text-sm text-gray-500">View and enter student marks</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/admin/bulk-upload/results">
                        <Button color="secondary" variant="flat" startContent={<Icon icon="mdi:cloud-upload" />}>
                            Bulk Upload
                        </Button>
                    </Link>
                    <Button color="primary" startContent={<Icon icon="mdi:plus" />}>
                        Add Results
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center border border-dashed border-gray-300 dark:border-gray-700">
                <Icon icon="mdi:chart-box-outline" className="text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Results Recorded</h3>
                <p className="text-gray-500 max-w-sm mt-2">
                    Select an exam to start entering marks for students.
                </p>
            </div>
        </div>
    );
}
