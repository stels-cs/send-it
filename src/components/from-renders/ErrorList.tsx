import { Alert, List, Space } from 'antd';
import { ErrorListProps, FormContextType, RJSFSchema, StrictRJSFSchema, TranslatableString } from '@rjsf/utils';

/** The `ErrorList` component is the template that renders the all the errors associated with the fields in the `Form`
 *
 * @param props - The `ErrorListProps` for this component
 */
// eslint-disable-next-line
export default function ErrorList<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
                                                                                                                       errors,
                                                                                                                       registry,
                                                                                                                     }: ErrorListProps<T, S, F>) {
  const { translateString } = registry;
  const renderErrors = () => (
    <List className='list-group' size='small'>
      {errors.map((error, index) => (
        <List.Item key={index} style={{paddingLeft:'0px'}}>
          <Space>
            {error.stack}
          </Space>
        </List.Item>
      ))}
    </List>
  );

  return (
    <Alert
      className='panel panel-danger errors'
      description={renderErrors()}
      message={translateString(TranslatableString.ErrorsLabel)}
      type='error'
    />
  );
}
