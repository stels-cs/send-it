import React from 'react';
import { Alert } from 'antd';
import { useRouter } from "next/router";
import { getTemplateById } from "@/templates";
import TemplateForm from "@/components/TemplateForm";

const TemplatePicker: React.FC = () => {
  const router = useRouter();
  const templateId = router.query.name

  if (templateId && typeof templateId === 'string') {
    const template = getTemplateById(templateId)
    if (template.type === 'error') {
      return <Alert
        message="Error"
        description={template.reason}
        type="error"
      />
    }
    return <TemplateForm template={template.template} />
  } else {
    return <Alert
      message="Template not found"
      description="This link is broken"
      type="error"
    />
  }
};

export default TemplatePicker;
