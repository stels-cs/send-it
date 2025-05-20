import { getSubmitButtonOptions, SubmitButtonProps } from "@rjsf/utils";
import { Button, Form } from "antd";
import React from "react";


export const SubmitButton = (props: SubmitButtonProps) => {
  const { uiSchema } = props;
  const { norender, submitText, props:xPros } = getSubmitButtonOptions(uiSchema);
  if (norender) {
    return null;
  }
  return <Form.Item>
    <Button disabled={xPros?.disabled} type="primary" htmlType="submit">
      {submitText}
    </Button>
  </Form.Item>
}
