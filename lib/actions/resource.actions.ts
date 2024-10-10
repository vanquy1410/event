"use server"

import { connectToDatabase } from "@/lib/database";
import Resource from "@/lib/database/models/resource.model";

interface ResourceData {
  name: string;
  type: string;
  url: string;
}

interface GetAllResourcesParams {
  query?: string;
  limit?: number;
  page?: number;
}

export async function getAllResources({ query, limit = 10, page = 1 }: GetAllResourcesParams) {
  try {
    await connectToDatabase();

    const conditions = query
      ? { name: { $regex: query, $options: "i" } }
      : {};

    const skipAmount = (page - 1) * limit;

    const resources = await Resource.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const resourcesCount = await Resource.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(resources)),
      totalPages: Math.ceil(resourcesCount / limit),
    };
  } catch (error) {
    console.error(error);
  }
}

export async function createResource(resourceData: ResourceData) {
  try {
    await connectToDatabase();

    const newResource = await Resource.create(resourceData);

    return JSON.parse(JSON.stringify(newResource));
  } catch (error) {
    console.error(error);
  }
}

export async function updateResource(resourceId: string, resourceData: Partial<ResourceData>) {
  try {
    await connectToDatabase();

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      resourceData,
      { new: true }
    );

    if (!updatedResource) throw new Error("Resource not found");

    return JSON.parse(JSON.stringify(updatedResource));
  } catch (error) {
    console.error(error);
  }
}

export async function deleteResource({ resourceId }: { resourceId: string }) {
  try {
    await connectToDatabase();

    const deletedResource = await Resource.findByIdAndDelete(resourceId);

    if (!deletedResource) throw new Error("Resource not found");

    return JSON.parse(JSON.stringify(deletedResource));
  } catch (error) {
    console.error(error);
  }
}
