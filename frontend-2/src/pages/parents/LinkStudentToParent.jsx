import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Input,
    Chip,
    Select,
    SelectItem
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { studentService, parentService, academicService } from '@/services'; // assuming parentService exists or we fetch parent via other means
import { PageHeader } from '@/components/common';

export default function LinkStudentToParent() {
    const { parentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [parent, setParent] = useState(location.state?.parent || null);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("all");

    useEffect(() => {
        if (parentId) {
            if (!parent) {
                fetchParentDetails();
            }
            fetchUnassignedStudents();
            fetchClasses();
        }
    }, [parentId]);

    useEffect(() => {
        filterStudents();
    }, [searchQuery, classFilter, students]);

    const fetchParentDetails = async () => {
        // Implement getParentById if avail, or fetch all and find. 
        // For efficiency, assume GET /parents/:id logic exists or we can just show ID/Name if possible.
        // Assuming getAllParents is cached or quick enough, or we need a new service method.
        // Let's assume we can fetch all parents and find for now, or use a new endpoint if strict.
        // Given current parentService only has getAllParents, let's use that for MVP or assume fetchParentById.
        // But better: Just display "Link Students" generic title if we can't get name easily without extra API.
        // wait, we can try to get parent details.
        try {
            // Note: Ideally request specific parent endpoint.
            const response = await parentService.getAllParents(); // Optimization needed later
            if (response.data?.success) {
                const found = response.data.data.parents.find(p => p.id === parentId);
                setParent(found);
            }
        } catch (error) {
            console.error("Error fetching parent:", error);
        }
    };

    const fetchUnassignedStudents = async () => {
        setLoading(true);
        try {
            const response = await studentService.getAllStudents({ parentId: 'null' });
            if (response.data?.success) {
                setStudents(response.data.data.students);
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
                setClasses(response.data.data.classes);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    const filterStudents = () => {
        let filtered = [...students];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.admissionNumber.toLowerCase().includes(query)
            );
        }

        if (classFilter !== "all") {
            filtered = filtered.filter(s => s.classId === classFilter);
        }

        setFilteredStudents(filtered);
    };

    const handleLinkStudents = async () => {
        if (selectedKeys.size === 0 && selectedKeys !== "all") return;

        let idsToLink = [];
        if (selectedKeys === "all") {
            idsToLink = filteredStudents.map(s => s.id);
        } else {
            idsToLink = Array.from(selectedKeys);
        }

        try {
            const response = await studentService.bulkUpdateStudents({
                studentIds: idsToLink,
                parentId: parentId
            });

            if (response.data?.success) {
                // Navigate back
                navigate('/parents');
            }
        } catch (error) {
            console.error("Error linking students:", error);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <PageHeader
                title={parent ? `Link Students to ${parent.guardianName}` : "Link Students to Parent"}
                description="Select unassigned students to link to this parent account."
                backLink="/parents"
            />

            <div className="flex gap-4 items-end bg-content1 p-4 rounded-large shadow-sm">
                <Input
                    label="Search Student"
                    placeholder="Name or Admission No."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    startContent={<Icon icon="mdi:magnify" />}
                    className="max-w-xs"
                />
                <Select
                    label="Filter by Class"
                    placeholder="All Classes"
                    selectedKeys={[classFilter]}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="max-w-xs"
                >
                    <SelectItem key="all" value="all">All Classes</SelectItem>
                    {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                            {cls.name} - {cls.section}
                        </SelectItem>
                    ))}
                </Select>
                <div className="ml-auto">
                    <Button
                        color="primary"
                        isDisabled={selectedKeys.size === 0 && selectedKeys !== "all"}
                        onPress={handleLinkStudents}
                        startContent={<Icon icon="mdi:link-variant" />}
                    >
                        Link Selected ({selectedKeys === "all" ? filteredStudents.length : selectedKeys.size})
                    </Button>
                </div>
            </div>

            <Table
                aria-label="Unassigned Students Table"
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
            >
                <TableHeader>
                    <TableColumn>ADMISSION NO</TableColumn>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>CLASS</TableColumn>
                    <TableColumn>GENDER</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No unassigned students found"} isLoading={loading}>
                    {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell>{student.admissionNumber}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-bold text-small">{student.name}</span>
                                    <span className="text-tiny text-default-400">{student.dob}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {student.Class ? (
                                    <span>{student.Class.name}-{student.Class.section}</span>
                                ) : (
                                    <span className="text-default-400">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Chip size="sm" variant="flat" color={student.gender === 'Male' ? 'primary' : 'secondary'}>
                                    {student.gender}
                                </Chip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
