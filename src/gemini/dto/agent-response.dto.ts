import { ApiProperty } from '@nestjs/swagger';

export class ChatAssistantResponseDto {
  @ApiProperty({ description: 'AI response message' })
  response: string;

  @ApiProperty({ description: 'Response timestamp' })
  timestamp: Date;
}

export class FieldOptionDto {
  @ApiProperty({ description: 'Option display label', example: 'FOB - Free on Board' })
  label: string;

  @ApiProperty({ description: 'Option value', example: 'FOB' })
  value: string;

  @ApiProperty({ description: 'Display order', example: 1 })
  order: number;

  @ApiProperty({ description: 'Whether this is the default option', example: false })
  isDefault: boolean;
}

export class FieldValidationDto {
  @ApiProperty({
    description: 'Type of validation rule',
    enum: ['REQUIRED', 'MIN_LENGTH', 'MAX_LENGTH', 'MIN', 'MAX', 'PATTERN', 'EMAIL', 'URL', 'CUSTOM'],
    example: 'REQUIRED',
  })
  ruleType: 'REQUIRED' | 'MIN_LENGTH' | 'MAX_LENGTH' | 'MIN' | 'MAX' | 'PATTERN' | 'EMAIL' | 'URL' | 'CUSTOM';

  @ApiProperty({ description: 'Validation value (e.g., "5" for MIN_LENGTH)', example: '5', required: false })
  value?: string;

  @ApiProperty({ description: 'Error message to display', example: 'This field is required' })
  errorMessage: string;
}

export class FormFieldDto {
  @ApiProperty({ description: 'Unique field key (camelCase)', example: 'applicantName' })
  key: string;

  @ApiProperty({ description: 'Display label', example: 'Applicant Name' })
  label: string;

  @ApiProperty({
    description: 'Field type',
    enum: ['TEXT', 'TEXTAREA', 'NUMBER', 'EMAIL', 'DATE', 'CHECKBOX', 'RADIO', 'SELECT', 'FILE', 'PASSWORD', 'URL', 'TEL'],
    example: 'TEXT',
  })
  fieldType: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'EMAIL' | 'DATE' | 'CHECKBOX' | 'RADIO' | 'SELECT' | 'FILE' | 'PASSWORD' | 'URL' | 'TEL';

  @ApiProperty({ description: 'Placeholder text', example: 'Enter your name', required: false })
  placeholder?: string;

  @ApiProperty({ description: 'Default value', required: false })
  defaultValue?: string;

  @ApiProperty({ description: 'Help text', example: 'Legal name of the applicant', required: false })
  helpText?: string;

  @ApiProperty({ description: 'Field display order', example: 1 })
  order: number;

  @ApiProperty({ description: 'Field width (full, half, third)', example: 'half', required: false })
  width?: string;

  @ApiProperty({ description: 'Options for SELECT, RADIO, CHECKBOX fields', type: [FieldOptionDto], required: false })
  options?: FieldOptionDto[];

  @ApiProperty({ description: 'Validation rules', type: [FieldValidationDto], required: false })
  validations?: FieldValidationDto[];
}

export class RequirementAnalysisResponseDto {
  @ApiProperty({
    description: 'Brief analysis of the requirement',
    example: 'Generated a Letter of Credit application form based on your requirements',
  })
  analysis: string;

  @ApiProperty({
    description: 'Name of the generated form template',
    example: 'Letter of Credit Application',
  })
  formTemplateName: string;

  @ApiProperty({
    description: 'Description of the form template',
    example: 'Form for applying for Letters of Credit for international trade',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Array of form fields matching Prisma schema',
    type: [FormFieldDto],
  })
  fields: FormFieldDto[];

  @ApiProperty({
    description: 'Additional notes or recommendations',
    example: 'Consider adding beneficiary details and shipping terms',
    required: false,
  })
  additionalNotes?: string;
}
