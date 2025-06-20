import { useState } from 'react';
import { useStore } from '../../store';

import { Modal } from '../Modal';

import { SavedReport } from '../ui/SavedReport';

import type { SavedReport as SavedReportType } from '../../types/Report';

import styles from './ReportsHistory.module.css';
import { SavedReportHighlights } from '../SavedReportHighlights';

export const ReportsHistory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<SavedReportType | null>(null);

  const savedReports = useStore((store) => store.savedReports);
  const removeReportById = useStore((store) => store.removeReportById);

  return (
    <>
      <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedReport?.report && <SavedReportHighlights report={selectedReport.report} />}
      </Modal>
      <div className={styles.container}>
        {savedReports.map((report) => (
          <SavedReport
            key={report.id}
            savedReport={report}
            onDelete={() => {
              removeReportById(report.id);
            }}
            onOpenReport={() => {
              if (!report.isFailed) {
                setIsModalOpen(true);
                setSelectedReport(report);
              }
            }}
          />
        ))}
      </div>
    </>
  );
};
