import { useState } from 'react';

import { Title } from '../ui/Title';
import { BoldText } from '../ui/BoldText';
import { Button } from '../ui/Button';

import styles from './UploadCSVForm.module.css';
import { UploadFile } from '../UploadFile';
import { useStore } from '../../store';

export const UploadCSVForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const aggregateReport = useStore((store) => store.aggregateReport);
  const isReportLoading = useStore((store) => store.isReportLoading);
  const isReportError = useStore((store) => store.isReportError);
  const isReportSuccess = useStore((store) => store.isReportSuccess);

  return (
    <div className={styles.container}>
      <Title>
        Загрузите <BoldText>csv</BoldText> файл и получите <BoldText>полную информацию</BoldText> о
        нём за сверхнизкое время
      </Title>
      <form className={styles.form}>
        <UploadFile selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
        {isReportError || isReportLoading || isReportSuccess ? null : (
          <Button
            variant="send"
            type="button"
            className={styles.button}
            disabled={!selectedFile}
            onClick={() => {
              if (selectedFile) {
                aggregateReport(selectedFile, 10000);
              }
            }}
          >
            Отправить
          </Button>
        )}
      </form>
    </div>
  );
};
