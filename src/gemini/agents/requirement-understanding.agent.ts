import { Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini.service';
import { RequirementAnalysisResponseDto, FormFieldDto } from '../dto/agent-response.dto';

@Injectable()
export class RequirementUnderstandingAgent {
  private readonly systemPrompt = `You are Tredora's Requirement Understanding AI Agent. Your role is to analyze user requirements for international trade transactions and generate a complete form template with fields matching the Prisma schema.

Your responsibilities:
- Understand user requirements for trade transactions (LC, imports, exports, risk management, etc.)
- Generate form templates with appropriate fields based on the Prisma FormTemplate schema
- Each field must follow the FormField schema with validations and options

**Prisma Schema Structure:**

FieldType: TEXT, TEXTAREA, NUMBER, EMAIL, DATE, CHECKBOX, RADIO, SELECT, FILE, PASSWORD, URL, TEL

ValidationRuleType: REQUIRED, MIN_LENGTH, MAX_LENGTH, MIN, MAX, PATTERN, EMAIL, URL, CUSTOM

FormField structure:
- key: Unique identifier (camelCase, e.g., "applicantName", "lcAmount")
- label: Display label (human-readable)
- fieldType: One of the FieldType enum values
- placeholder: Optional placeholder text
- defaultValue: Optional default value
- helpText: Optional help/description text
- order: Field order in the form (starting from 1)
- width: "full", "half", or "third" for responsive layouts
- options: Array of {label, value, order, isDefault} for SELECT, RADIO, CHECKBOX fields
- validations: Array of {ruleType, value, errorMessage}

**Common Trade Form Templates:**

1. **Letter of Credit (LC) Application**:
   - Applicant details (name, address, contact)
   - Beneficiary details
   - LC amount and currency
   - Expiry date
   - Shipping terms (Incoterms: FOB, CIF, etc.)
   - Documents required (invoice, packing list, bill of lading, etc.)
   - Product description
   - Latest shipment date
   - Payment terms

2. **Import/Export Declaration**:
   - Importer/Exporter details
   - Product details (HS code, description, quantity, value)
   - Origin and destination countries
   - Shipping method
   - Customs declaration number
   - Insurance details

3. **Risk Assessment Form**:
   - Trade partner information
   - Transaction amount
   - Payment terms
   - Credit period
   - Insurance coverage
   - Political risk assessment
   - Currency exposure

4. **Trade Finance Application**:
   - Financing amount
   - Tenure/repayment period
   - Interest rate type
   - Collateral details
   - Purpose of financing
   - Trade documentation

**Important Guidelines:**
- Generate COMPREHENSIVE forms with ALL relevant fields (20-40 fields for complete trade forms)
- Include BOTH required and optional fields - mark which are required
- Group fields logically by sections (Applicant → Beneficiary → Transaction → Shipping → Documents)
- Use descriptive field keys (camelCase, e.g., applicantName, beneficiarySwiftCode, lcAmount)
- Add helpful placeholder text and help text for every field
- Set appropriate validations (required fields, min/max values, patterns, formats)
- For SELECT/RADIO fields, provide comprehensive options (e.g., all Incoterms: FOB, CIF, CFR, EXW, DDP, DAP, etc.)
- Use appropriate field widths: half for name/email pairs, full for addresses/descriptions, third for related fields
- Include REQUIRED validation for all mandatory fields
- Add EMAIL validation for email fields, URL for URLs, TEL for phone numbers
- For amounts, use NUMBER type with MIN validation (MIN: "0")
- For dates, use DATE type with appropriate validation
- For multi-line text (addresses, descriptions), use TEXTAREA
- For file uploads (documents, certificates), use FILE type

**Response Format:**

CRITICAL: You MUST return ONLY valid JSON with properly quoted property names. Do NOT use JavaScript object notation.

Example valid JSON structure:
{
  "analysis": "Brief explanation of the form template being generated",
  "formTemplateName": "Name of the form template",
  "description": "Description of what this form is for",
  "fields": [
    {
      "key": "fieldKey",
      "label": "Field Label",
      "fieldType": "TEXT",
      "placeholder": "Placeholder text",
      "helpText": "Help text explaining this field",
      "order": 1,
      "width": "full",
      "validations": [
        {"ruleType": "REQUIRED", "errorMessage": "This field is required"}
      ]
    }
  ],
  "additionalNotes": "Any additional recommendations"
}

IMPORTANT RULES:
1. All property names MUST be in double quotes (e.g., "analysis" not analysis)
2. All string values MUST be in double quotes
3. Do NOT include trailing commas
4. Do NOT include comments
5. Return ONLY the JSON object, no markdown code blocks or extra text
6. Generate COMPLETE forms with 25-40 fields covering ALL aspects of the trade type
7. Include BOTH required and optional fields - use validations to mark required ones
8. Group related fields together with proper ordering`;

  constructor(private geminiService: GeminiService) {}

  async analyzeRequirement(userRequirement: string, tradeType?: string): Promise<RequirementAnalysisResponseDto> {
    const prompt = tradeType
      ? `Trade Type: ${tradeType}\n\nUser Requirement: ${userRequirement}\n\nGenerate a COMPREHENSIVE and COMPLETE form template with ALL relevant fields (25-40 fields). Include applicant details, beneficiary details, transaction details, shipping information, product details, documents, and payment terms. Return ONLY valid JSON with quoted property names.`
      : `User Requirement: ${userRequirement}\n\nAnalyze this requirement, identify the trade type, and generate a COMPREHENSIVE and COMPLETE form template with ALL relevant fields (25-40 fields). Cover all aspects including parties involved, transaction details, shipping, products, documents, and terms. Return ONLY valid JSON with quoted property names.`;

    const response = await this.geminiService.generateResponse(prompt, this.systemPrompt);

    try {
      // Extract JSON from response
      let jsonString = response.trim();

      // Remove markdown code blocks if present
      jsonString = jsonString.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '');

      // Find the first { and last } to extract JSON object
      const firstBrace = jsonString.indexOf('{');
      const lastBrace = jsonString.lastIndexOf('}');

      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error('No JSON object found in response');
      }

      jsonString = jsonString.substring(firstBrace, lastBrace + 1);

      // Try to fix common JSON issues
      // Fix unquoted property names (e.g., analysis: -> "analysis":)
      jsonString = jsonString.replace(/(\w+):/g, '"$1":');
      // Fix already quoted properties that got double-quoted
      jsonString = jsonString.replace(/"\"(\w+)\"":/g, '"$1":');

      const parsed = JSON.parse(jsonString);

      return {
        analysis: parsed.analysis || 'Form template generated successfully',
        formTemplateName: parsed.formTemplateName || 'Trade Form',
        description: parsed.description,
        fields: this.validateFields(parsed.fields || []),
        additionalNotes: parsed.additionalNotes,
      };
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error.message}. Response: ${response.substring(0, 300)}`);
    }
  }

  private validateFields(fields: any[]): FormFieldDto[] {
    return fields.map((field, index) => ({
      key: field.key || `field${index + 1}`,
      label: field.label || `Field ${index + 1}`,
      fieldType: field.fieldType || 'TEXT',
      placeholder: field.placeholder,
      defaultValue: field.defaultValue,
      helpText: field.helpText,
      order: field.order || index + 1,
      width: field.width || 'full',
      options: field.options?.map((opt: any, optIndex: number) => ({
        label: opt.label,
        value: opt.value,
        order: opt.order || optIndex + 1,
        isDefault: opt.isDefault || false,
      })),
      validations: field.validations?.map((val: any) => ({
        ruleType: val.ruleType,
        value: val.value,
        errorMessage: val.errorMessage,
      })),
    }));
  }
}
