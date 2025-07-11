import {Pagination} from "@nextui-org/react";
import React from "react";

interface Props {
  page: number;
  setPage: (page: number) => void;
  total: number;
}

const BottomContent = ({page, setPage, total}: Props) => (
  <div className="flex w-full justify-center">
    <Pagination
      classNames={{
        cursor: "bg-foreground text-background",
      }}
      color="default"
      onChange={setPage}
      page={page}
      showControls
      total={total || 1}
      variant="light"
    />
  </div>
);

export default BottomContent;
