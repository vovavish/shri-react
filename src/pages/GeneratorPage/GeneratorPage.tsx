import { useEffect, useState } from 'react';

import { useStore } from '../../store';

import {
  ButtonDownload,
  type ButtonDownloadProps,
} from '../../components/ui/ButtonDownload/ButtonDownload';
import { Title } from '../../components/ui/Title';

export const GeneratorPage = () => {
  const getReport = useStore((store) => store.getReport);
  const resetReportGenerating = useStore((store) => store.resetReportGenerating);
  const isReportGenerating = useStore((store) => store.isReportGenerating);
  const isReportGeneratingError = useStore((store) => store.isReportGeneratingError);
  const isReportGeneratingSuccess = useStore((store) => store.isReportGeneratingSuccess);

  const [buttonVariant, setButtonVariant] = useState<ButtonDownloadProps['variant']>('initial');

  useEffect(() => {
    if (isReportGeneratingError) {
      setButtonVariant('error');
      return;
    }

    if (isReportGenerating) {
      setButtonVariant('loading');
      return;
    }

    if (isReportGeneratingSuccess) {
      setButtonVariant('success');
      return;
    }
  }, [isReportGenerating, isReportGeneratingError, isReportGeneratingSuccess]);

  return (
    <div>
      <Title>Сгенерируйте готовый csv-файл нажатием одной кнопки</Title>
      <ButtonDownload
        variant={buttonVariant}
        onClick={() => !isReportGenerating && !isReportGeneratingError && getReport()}
        onClearClick={() => {
          resetReportGenerating();
          setButtonVariant('initial');
        }}
      />
    </div>
  );
};
