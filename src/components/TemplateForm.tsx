import React, { useMemo, useState } from "react";
import { TemplateType } from "@/templates/type";
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import { Button, Form as AntdForm, Typography } from 'antd';
import { SubmitButton } from "@/components/from-renders/SubmitButton";
import ArrayFieldTemplate from "@/components/from-renders/ArrayFieldTemplate";
import ObjectFieldTemplate from "@/components/from-renders/ObjectFieldTemplate";
import ResultAlert from "@/components/ResultAlert";
import { useTemplateFormControl } from "@/hooks/useTeplateFormControl";
import ErrorAlert from "@/components/ErrorAlert";
import { useShareAndRestoreData } from "@/hooks/useShareAndRestoreData";
import ShareCopyButton from "@/components/ShareCopyButton";
import { RJSFSchema } from "@rjsf/utils";
import { t } from "@/getLang";
import ErrorList from "@/components/from-renders/ErrorList";

const { Paragraph, Title } = Typography


const TemplateForm: React.FC<{ template: TemplateType }> = ({ template }) => {
  const schema = useMemo(() => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ...template.schema,
    $schema: undefined
  }), [ template.schema ])

  const { preloadData, generateMemoLink } = useShareAndRestoreData(template.id);
  const { result, loading, clearError, error, onExportCLick, onSubmit } = useTemplateFormControl(template)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ formData, setFormData ] = useState<any>(preloadData)

  return <div>
    <ShareCopyButton getUrl={() => generateMemoLink(formData)} />
    <Title>{template.name}</Title>
    <Paragraph>{template.description}</Paragraph>
    {!!error && <ErrorAlert error={error} clearError={clearError} />}
    {!!result && <ResultAlert boc={result} />}
    <Form validator={validator}
          disabled={loading}
          onChange={data => {
            setFormData(data.formData)
          }}
          formData={formData}
          templates={{
            ButtonTemplates: { SubmitButton },
            ArrayFieldTemplate,
            ObjectFieldTemplate,
            ErrorListTemplate: ErrorList,
          }}
          onSubmit={data => {
            onSubmit(data.formData)
          }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
          schema={schema as any as RJSFSchema}>
      <div style={{}}>
        <AntdForm.Item>
          <Button loading={loading} type="primary" htmlType="submit">
            {t({
              en: 'Send Transaction',
              ru: 'Отправить транзакцию',
            })}
          </Button>
        </AntdForm.Item>
        <AntdForm.Item>
          <Button onClick={onExportCLick} loading={loading} type="default" htmlType="submit">
            {t({
              en: 'Export Transaction to JSON',
              ru: 'Экспортировать транзакцию в JSON',
            })}
          </Button>
        </AntdForm.Item>
      </div>
    </Form>
  </div>
}

export default TemplateForm
