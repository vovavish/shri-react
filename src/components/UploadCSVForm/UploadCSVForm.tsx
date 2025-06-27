import { Title } from '../ui/Title';
import { BoldText } from '../ui/BoldText';
import { Button } from '../ui/Button';

import { UploadFile } from '../UploadFile';
import { useStore } from '../../store';

import styles from './UploadCSVForm.module.css';

export const UploadCSVForm = () => {
  const aggregateReport = useStore((store) => store.aggregateReport);
  const isReportLoading = useStore((store) => store.isReportLoading);
  const isReportError = useStore((store) => store.isReportError);
  const isReportSuccess = useStore((store) => store.isReportSuccess);

  const csvFile = useStore((store) => store.csvFile);

  return (
    <div className={styles.container}>
      <Title data-testid="title">
        Загрузите <BoldText>csv</BoldText> файл и получите <BoldText>полную информацию</BoldText> о
        нём за сверхнизкое время
      </Title>
      <form className={styles.form}>
        <UploadFile />
        {isReportError || isReportLoading || isReportSuccess ? null : (
          <Button
            variant="send"
            type="button"
            className={styles.button}
            disabled={!csvFile}
            onClick={() => {
              if (csvFile) {
                aggregateReport(csvFile, 10000);
              }
            }}
            data-testid="button-send"
          >
            Отправить
          </Button>
        )}
      </form>
    </div>
  );
};
