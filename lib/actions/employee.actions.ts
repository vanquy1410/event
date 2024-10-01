"use server"

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from "@/lib/database";
import Employee from "@/lib/database/models/employee.model";
import { handleError } from "@/lib/utils";

export async function getAllEmployees({ query, limit = 10, page = 1 }: { query?: string, limit?: number, page?: number }) {
  try {
    await connectToDatabase();

    const conditions: { $or?: Array<{ [key: string]: any }> } = {};
    if (query) {
      conditions['$or'] = [
        { userAccount: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { position: { $regex: query, $options: 'i' } }
      ];
    }

    const skipAmount = (page - 1) * limit;

    const employees = await Employee.find(conditions)
      .skip(skipAmount)
      .limit(limit);

    console.log('Database query conditions:', conditions);
    console.log('Employees from database:', employees);

    const employeesCount = await Employee.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(employees)),
      totalPages: Math.ceil(employeesCount / limit)
    };
  } catch (error) {
    console.error('Error in getAllEmployees:', error);
    throw error;
  }
}

export async function createEmployee(employeeData: any) {
  try {
    await connectToDatabase();

    const newEmployee = await Employee.create(employeeData);
    console.log('New employee created:', newEmployee);
    revalidatePath('/admin/dashboard/employee-management');
    return JSON.parse(JSON.stringify(newEmployee));
  } catch (error) {
    console.error('Error in createEmployee:', error);
    throw error;
  }
}

export async function updateEmployee(employeeId: string, employeeData: any) {
  try {
    await connectToDatabase();

    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, employeeData, { new: true });
    revalidatePath('/admin/dashboard/employee-management');
    return JSON.parse(JSON.stringify(updatedEmployee));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteEmployee({ employeeId, path }: { employeeId: string; path: string }) {
  try {
    await connectToDatabase();

    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
    revalidatePath(path);
    return JSON.parse(JSON.stringify(deletedEmployee));
  } catch (error) {
    handleError(error);
  }
}
