import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsObject, IsOptional, IsString } from "class-validator";

export class SendEmailDto {
    @ApiProperty({ example: 'user@example.com'})
    @IsEmail()
    to: string;

    @ApiProperty({ example: 'Test Email'})
    @IsString()
    subject: string;

    @ApiProperty({ example: '<p>Hello, world!</p>'})
    @IsString()
    html?: string;

    @ApiProperty({ example: 'welcome-template'})
    @IsString()
    templateId?: string;
    
    @ApiProperty({ example: { name: 'John Doe', require: false }})
    @IsOptional()
    @IsObject()
    vars?: Record<string, any>;
}