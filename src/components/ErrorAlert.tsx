import React from "react";
import { Alert } from "antd";


const ErrorAlert: React.FC<{ error: unknown, clearError: () => void }> = ({ error,clearError }) => {
  return <Alert
    message={error instanceof Error ? error.message : JSON.stringify(error)}
    type="error"
    closable
    onClose={clearError}
  />
}

export default ErrorAlert;
