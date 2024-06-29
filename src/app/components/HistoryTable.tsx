import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Modal,
  NumberFormatter,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconSearch,
  IconEngine,
  IconPackageExport,
  IconPackageImport,
  IconArticleFilled,
} from "@tabler/icons-react";
import cx from "clsx";
import classes from "./TableScrollArea.module.css";
import { Part, Car } from "../type";
import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { useDisclosure } from "@mantine/hooks";

import AddPartModal from "@components/PartModal/AddPartModal";
// import EditPartModal from "./PartModal/EditPartModal";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { PartType } from "../type";

function removeDuplicates(arr: any[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const PartHistoryTable = () => {
  

  return (
    <div>
      กำลังพัฒนา
    </div>
  );
};

export default PartHistoryTable;
