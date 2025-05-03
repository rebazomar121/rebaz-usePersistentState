import React from "react";

export interface ImageData {
    uri: string;
    temp_uri?: {
      md?: { signedUrl: string };
      signedUrl?: string;
    };
    _id?: string;
    width?: number;
    height?: number;
    fileSize?: number;
    fileName?: string;
    type?: string;
  }

  export type UsePersistentStateReturn<T> = [
    T,
    React.Dispatch<React.SetStateAction<T>>,
    () => Promise<boolean>
  ];
