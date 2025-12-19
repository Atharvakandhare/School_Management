import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, Tabs, Tab, Progress, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { parentService } from '@/services';
import { PageHeader } from '@/components/common';

export default function ChildDashboard() {
    const { studentId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, [studentId]);

    const fetchDashboard = async () => {
        try {
            const response = await parentService.getChildDashboard(studentId);
            if (response.data?.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching child dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>Error loading data</div>;

    const { student, timetable, attendance, examResults } = data;

    return (
        <div className="space-y-6 p-6">
            <PageHeader
                title={student.name}
                description={`Admission No: ${student.admissionNumber} | Class: ${student.Class?.name || 'N/A'}`}
                showBack={true}
            />

            <Tabs aria-label="Student Options" color="primary" variant="underlined">
                <Tab
                    key="timetable"
                    title={
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:calendar-clock" />
                            <span>Timetable</span>
                        </div>
                    }
                >
                    <Card>
                        <CardBody>
                            {timetable.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {timetable.map((t) => (
                                        <div key={t.id} className="p-4 border rounded-lg bg-default-50">
                                            <p className="font-bold text-lg">{t.Subject.name}</p>
                                            <p className="text-small text-default-500">{t.dayOfWeek}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Icon icon="mdi:clock-outline" />
                                                <span>{t.startTime} - {t.endTime}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Icon icon="mdi:account" />
                                                <span>{t.User?.name || "Teacher"}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-10">No timetable available</p>
                            )}
                        </CardBody>
                    </Card>
                </Tab>

                <Tab
                    key="attendance"
                    title={
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:calendar-check" />
                            <span>Attendance</span>
                        </div>
                    }
                >
                    <Card>
                        <CardBody>
                            <div className="space-y-2">
                                {attendance.map((att) => (
                                    <div key={att.id} className="flex justify-between items-center p-3 border-b last:border-0">
                                        <span>{new Date(att.date).toLocaleDateString()}</span>
                                        <Chip
                                            color={att.status === 'Present' ? 'success' : att.status === 'Absent' ? 'danger' : 'warning'}
                                            variant="flat"
                                        >
                                            {att.status}
                                        </Chip>
                                    </div>
                                ))}
                                {attendance.length === 0 && <p className="text-center py-4">No attendance records</p>}
                            </div>
                        </CardBody>
                    </Card>
                </Tab>

                <Tab
                    key="exams"
                    title={
                        <div className="flex items-center space-x-2">
                            <Icon icon="mdi:file-certificate" />
                            <span>Marks & Results</span>
                        </div>
                    }
                >
                    <Card>
                        <CardBody>
                            <div className="space-y-4">
                                {examResults.map((res) => (
                                    <div key={res.id} className="p-4 border rounded-lg">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold">{res.Exam.name} - {res.Subject.name}</span>
                                            <span className="font-bold text-primary">{res.obtainedMarks} / {res.totalMarks}</span>
                                        </div>
                                        <Progress
                                            value={(res.obtainedMarks / res.totalMarks) * 100}
                                            color={(res.obtainedMarks / res.totalMarks) * 100 > 40 ? "success" : "danger"}
                                        />
                                    </div>
                                ))}
                                {examResults.length === 0 && <p className="text-center py-4">No exam results available</p>}
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}
