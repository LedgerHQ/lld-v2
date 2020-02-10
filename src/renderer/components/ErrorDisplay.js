// @flow
import { renderError } from "~/renderer/components/DeviceAction/rendering";

export type ErrorDisplayProps = {
  error: Error,
  onRetry?: () => void,
  withExportLogs?: boolean,
  children?: React$Node,
};

const ErrorDisplay = ({ error, onRetry, withExportLogs, children }: ErrorDisplayProps) =>
  renderError({ error, onRetry, withExportLogs, children });

export default ErrorDisplay;
