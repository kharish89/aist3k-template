"use server";

import { describeImageForVideo, createCollage } from "@/util/video";

export interface DescribeArgs {
  frames: string[];
  modelName: string;
};

export default async function describeFrame(request: DescribeArgs) {
  // TODO: implement
}