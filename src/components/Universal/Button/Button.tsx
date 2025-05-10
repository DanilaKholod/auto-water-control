"use client";

import { Button } from "antd";

export default function FormButton({
  title,
  type = "primary",
  size = "middle",
  className,
  block,
  htmlType,
  disabled,
  width,
  onClick,
}: {
  title: React.ReactNode;
  type?:"primary" | "dashed" | "link" | "text" | "default";
  size?:"large" | "middle" | "small";
  className?:string;
  block?:boolean;
  htmlType?:any;
  disabled?:boolean;
  width?:number;
  onClick?:any;
}) {
  return (
    <Button
      style={{ width:`${width}%`, display:"block" }}
      type={type}
      size={size}
      className={className}
      block={block}
      htmlType={htmlType}
      disabled={disabled}
      onClick={onClick}
    >
      {title}
    </Button>
  );
}