import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RequirementUnderstandingAgent } from './agents/requirement-understanding.agent';
import { ChatSupportRequestDto } from './dto/agent-request.dto';
import { RequirementAnalysisResponseDto } from './dto/agent-response.dto';

@ApiTags('AI Agent')
@Controller('ai')
export class GeminiController {
  constructor(private requirementAgent: RequirementUnderstandingAgent) {}

  @Post('chat')
  @ApiOperation({
    summary: 'Analyze trade requirement and generate form template',
    description: 'Send a natural language trade requirement and receive a structured form template with fields matching the Prisma schema. The AI will analyze the requirement and generate appropriate fields for LC, imports, exports, risk management, etc.',
  })
  @ApiBody({
    type: ChatSupportRequestDto,
    examples: {
      lcApplication: {
        summary: 'LC Application',
        value: {
          message: 'I need to create a Letter of Credit application form for importing textiles from China',
        },
      },
      riskAssessment: {
        summary: 'Risk Assessment',
        value: {
          message: 'Create a risk assessment form for evaluating new trade partners',
        },
      },
      importForm: {
        summary: 'Import Declaration',
        value: {
          message: 'I need an import declaration form with HS codes and customs information',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Form template successfully generated with fields',
    type: RequirementAnalysisResponseDto,
    schema: {
      example: {
        analysis: 'Generated a Letter of Credit application form based on your requirements',
        formTemplateName: 'Letter of Credit Application',
        description: 'Form for applying for Letters of Credit for international trade',
        fields: [
          {
            key: 'applicantName',
            label: 'Applicant Name',
            fieldType: 'TEXT',
            placeholder: 'Enter applicant full name',
            helpText: 'Legal name of the applicant',
            order: 1,
            width: 'half',
            validations: [
              {
                ruleType: 'REQUIRED',
                errorMessage: 'Applicant name is required',
              },
            ],
          },
          {
            key: 'lcAmount',
            label: 'LC Amount',
            fieldType: 'NUMBER',
            placeholder: 'Enter amount',
            helpText: 'Total LC amount in USD',
            order: 2,
            width: 'half',
            validations: [
              {
                ruleType: 'REQUIRED',
                errorMessage: 'LC amount is required',
              },
              {
                ruleType: 'MIN',
                value: '0',
                errorMessage: 'Amount must be greater than 0',
              },
            ],
          },
        ],
        additionalNotes: 'Consider adding beneficiary details and shipping terms',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input or AI failed to parse response',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - AI service unavailable',
  })
  async chat(@Body() dto: ChatSupportRequestDto): Promise<RequirementAnalysisResponseDto> {
    return await this.requirementAgent.analyzeRequirement(dto.message);
  }
}
