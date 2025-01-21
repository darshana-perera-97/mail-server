import React from "react";
import BackupButton from "./BackupButton";
import EmailListManager from "./EmailListManager";
import ScheduleBackup from "./ScheduleBackup";
import ViewScheduleComponent from "./ViewScheduleComponent";

export default function Design() {
  return (
    <div>
      {/* <BackupButton /> */}
      {/* <EmailListManager/> */}
      <ScheduleBackup />
      <ViewScheduleComponent />
    </div>
  );
}
