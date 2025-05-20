import { SendTransactionRequest } from "@tonconnect/sdk";


export interface BaseSchema {
  type?: string | undefined;
  $id?: string | undefined;
  id?: string | undefined;
  $schema?: string | undefined;
  $ref?: string | undefined;
  $anchor?: string | undefined;
  $defs?: { [key: string]: BaseSchema } | undefined;
  definitions?: { [key: string]: BaseSchema } | undefined;
  $comment?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  default?: unknown | undefined;
  examples?: unknown[] | undefined;
  readOnly?: boolean | undefined;
  writeOnly?: boolean | undefined;
  deprecated?: boolean | undefined;
  allOf?: BaseSchema[] | undefined;
  anyOf?: BaseSchema[] | undefined;
  oneOf?: BaseSchema[] | undefined;
  not?: BaseSchema | undefined;
  if?: BaseSchema | undefined;
  then?: BaseSchema | undefined;
  else?: BaseSchema | undefined;
  enum?: Array<string | number | boolean | null> | undefined;
  const?: string | number | boolean | null | undefined;
  [k: string]: unknown;

  /** A special key used as an intermediate representation of extends-style relationships. Omitted as a $ref with additional properties. */
  // _ref?: BaseSchema;
  _prefault?: unknown | undefined;
}

export type TemplateType = {
  id:string,
  name: string
  description: string
  schema: BaseSchema
  toTx: (input: object) => Promise<SendTransactionRequest>
}
