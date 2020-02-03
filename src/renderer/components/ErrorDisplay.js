// @flow
import { renderError } from "~/renderer/components/DeviceAction/rendering";

type Props = {
  error: Error,
  onRetry?: () => void,
  withExportLogs?: boolean,
};

const ErrorDisplay = ({ error, onRetry, withExportLogs }: Props) =>
  renderError({ error, onRetry, withExportLogs });

export default ErrorDisplay;
