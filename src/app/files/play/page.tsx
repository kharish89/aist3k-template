"use client";

import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  listOllamaVisionModels,
  fetchAndPlayTextToSpeech,
} from "@/app/actions";
import Button from "@/components/Button";
import serverDescribeVideo from "@/app/actions/describeVideo";

export interface PageParams {
  searchParams: {
    name: string;
  };
}

export default function Page({ searchParams }: PageParams) {
  return <>TODO: implement</>;
}
