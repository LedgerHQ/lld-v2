// @flow
import { renderError } from "~/renderer/components/DeviceAction/rendering";

export type ErrorDisplayProps = {
  error: Error,
  onRetry?: () => void,
  withExportLogs?: boolean,
};

const ErrorDisplay = ({ error, onRetry, withExportLogs }: ErrorDisplayProps) =>
  renderError({ error, onRetry, withExportLogs });

export default ErrorDisplay;
