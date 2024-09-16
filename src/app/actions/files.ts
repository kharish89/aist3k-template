"use server";

import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { TigrisObject } from '@/lib/tigris';

const client = new S3Client();

export default async function listFiles(): Promise<TigrisObject[]> {
  // TODO: implement
  return [];
}