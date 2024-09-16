"use server";

import {
  videoToFrames,
  downloadVideo,
  makeCollage,
  listTigrisDirectoryItems,
  tigrisCollagesDir,
} from "@/util/video";

export interface DescribeVideoArgs {
  url: string;
  key: string;
  modelName: string;
};

export default async function describeVideo(data: DescribeVideoArgs): Promise<void> {
  // TODO: implement
}